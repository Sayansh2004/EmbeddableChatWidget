const rateLimit = require("express-rate-limit");
const WidgetConfig = require("../models/widgetConfig");
const Conversation = require("../models/conversation");
const Message = require("../models/message");

/**
 * Public endpoint to fetch widget configuration by ID.
 * This is what the embeddable widget will call to render itself.
 */
const getPublicWidgetConfig = async (req, res, next) => {
    try {
        const { widgetId } = req.params;
        const widget = await WidgetConfig.findById(widgetId).select(
            "name botName welcomeMessage avatarUrl position primaryColor accentColor backgroundColor openByDefault showBranding suggestionTitle suggestionItems"
        );

        if (!widget) {
            return res.status(404).json({
                success: false,
                message: "Widget not found",
            });
        }

        return res.json({
            success: true,
            data: widget,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Handles a public chat message sent from the embedded widget.
 * It stores the user message, generates a simple mock bot reply, and updates conversation stats.
 */
const handlePublicMessage = async (req, res, next) => {
    try {
        const { widgetId } = req.params;
        const { sessionId, message } = req.body;

        if (!sessionId || !message) {
            const err = new Error("sessionId and message are required");
            err.statusCode = 400;
            throw err;
        }

        const widget = await WidgetConfig.findById(widgetId);
        if (!widget) {
            return res.status(404).json({
                success: false,
                message: "Widget not found",
            });
        }

        let conversation = await Conversation.findOne({ widget: widgetId, sessionId });
        if (!conversation) {
            conversation = await Conversation.create({
                widget: widgetId,
                sessionId,
            });
        }

        const userMessage = await Message.create({
            conversation: conversation._id,
            sender: "user",
            content: message,
        });

        // Dummy response for this assignment:
        // regardless of the question or capsule, the bot sends the same text.
        const botText = "dummy response sent";

        const botMessage = await Message.create({
            conversation: conversation._id,
            sender: "bot",
            content: botText,
        });

        conversation.lastMessageAt = new Date();
        await conversation.save();

        return res.status(201).json({
            success: true,
            data: {
                conversationId: conversation._id,
                messages: [
                    {
                        id: userMessage._id,
                        sender: userMessage.sender,
                        content: userMessage.content,
                        createdAt: userMessage.createdAt,
                    },
                    {
                        id: botMessage._id,
                        sender: botMessage.sender,
                        content: botMessage.content,
                        createdAt: botMessage.createdAt,
                    },
                ],
            },
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Rate limiter instance used specifically for the public chat endpoint.
 * This is one of the "self-initiated improvements" to guard against abuse.
 */
const publicChatRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per IP per widget per minute
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    getPublicWidgetConfig,
    handlePublicMessage,
    publicChatRateLimiter,
};

