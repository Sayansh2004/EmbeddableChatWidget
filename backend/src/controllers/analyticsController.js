const Conversation = require("../models/conversation");
const Message = require("../models/message");

/**
 * Returns simple analytics for a widget:
 * - total conversations
 * - total messages
 * - conversations per day for the last 7 days
 */
const getWidgetAnalytics = async (req, res, next) => {
    try {
        const { id } = req.params;
        const ownerId = req.user.id;

        // Ownership is enforced indirectly via conversation lookup.
        const conversations = await Conversation.find({ widget: id })
            .populate({
                path: "widget",
                select: "owner",
            })
            .lean();

        if (!conversations.length || conversations[0].widget.owner.toString() !== ownerId) {
            return res.status(404).json({
                success: false,
                message: "Widget analytics not found for this user",
            });
        }

        const conversationIds = conversations.map((c) => c._id);

        const totalConversations = conversations.length;

        const messagesAgg = await Message.aggregate([
            { $match: { conversation: { $in: conversationIds } } },
            { $group: { _id: null, totalMessages: { $sum: 1 } } },
        ]);

        const totalMessages = messagesAgg[0]?.totalMessages || 0;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

        const perDay = await Conversation.aggregate([
            {
                $match: {
                    _id: { $in: conversationIds },
                    createdAt: { $gte: sevenDaysAgo },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id": 1 } },
        ]);

        // --- NEW: Fetch recent conversation history ---
        // We'll grab the 10 most recent conversations for this widget
        const recentConversations = await Conversation.find({ _id: { $in: conversationIds } })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        // For each of those 10 conversations, grab their related messages
        const recentConvoIds = recentConversations.map(c => c._id);
        const recentMessages = await Message.find({ conversation: { $in: recentConvoIds } })
            .sort({ createdAt: 1 }) // Chronological order so chat reads top-to-bottom
            .lean();

        // Group messages into their respective conversations
        const history = recentConversations.map(conv => {
            const messagesForConv = recentMessages.filter(
                (m) => m.conversation.toString() === conv._id.toString()
            );
            return {
                id: conv._id,
                sessionId: conv.sessionId,
                startedAt: conv.createdAt,
                messages: messagesForConv.map(m => ({
                    sender: m.sender,
                    content: m.content,
                    createdAt: m.createdAt
                }))
            };
        });

        return res.json({
            success: true,
            data: {
                totalConversations,
                totalMessages,
                conversationsPerDay: perDay,
                history, // Send the recent chat history back to the frontend!
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { getWidgetAnalytics };

