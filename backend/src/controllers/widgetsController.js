const WidgetConfig = require("../models/widgetConfig");
const Conversation = require("../models/conversation");
const Message = require("../models/message");

/**
 * Create a new widget configuration for the authenticated user.
 */
const createWidget = async (req, res, next) => {
    try {
        const ownerId = req.user.id;
        const {
            name,
            botName,
            welcomeMessage,
            avatarUrl,
            position,
            primaryColor,
            accentColor,
            backgroundColor,
            openByDefault,
            showBranding,
            suggestionTitle,
            suggestionItems,
        } = req.body;

        if (!name) {
            const err = new Error("Widget name is required");
            err.statusCode = 400;
            throw err;
        }

        const widget = await WidgetConfig.create({
            owner: ownerId,
            name,
            botName,
            welcomeMessage,
            avatarUrl,
            position,
            primaryColor,
            accentColor,
            backgroundColor,
            openByDefault,
            showBranding,
            suggestionTitle,
            suggestionItems,
        });

        return res.status(201).json({
            success: true,
            message: "Widget created successfully",
            data: widget,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * List all widgets for the current user with lightweight analytics.
 */
const listWidgets = async (req, res, next) => {
    try {
        const ownerId = req.user.id;
        const widgets = await WidgetConfig.find({ owner: ownerId }).sort({ createdAt: -1 });

        const widgetIds = widgets.map((w) => w._id);
        const conversationsCount = await Conversation.aggregate([
            { $match: { widget: { $in: widgetIds } } },
            { $group: { _id: "$widget", totalConversations: { $sum: 1 } } },
        ]);

        const messagesCount = await Message.aggregate([
            { $match: { conversation: { $exists: true } } },
            {
                $lookup: {
                    from: "conversations",
                    localField: "conversation",
                    foreignField: "_id",
                    as: "conv",
                },
            },
            { $unwind: "$conv" },
            { $match: { "conv.widget": { $in: widgetIds } } },
            { $group: { _id: "$conv.widget", totalMessages: { $sum: 1 } } },
        ]);

        const convMap = new Map(
            conversationsCount.map((c) => [c._id.toString(), c.totalConversations])
        );
        const msgMap = new Map(
            messagesCount.map((m) => [m._id.toString(), m.totalMessages])
        );

        const enriched = widgets.map((w) => {
            const idStr = w._id.toString();
            return {
                ...w.toObject(),
                metrics: {
                    totalConversations: convMap.get(idStr) || 0,
                    totalMessages: msgMap.get(idStr) || 0,
                },
            };
        });

        return res.json({
            success: true,
            data: enriched,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Fetch a single widget owned by the current user.
 */
const getWidgetById = async (req, res, next) => {
    try {
        const ownerId = req.user.id;
        const { id } = req.params;

        const widget = await WidgetConfig.findOne({ _id: id, owner: ownerId });
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
 * Update widget configuration. Ownership is enforced at query level.
 */
const updateWidget = async (req, res, next) => {
    try {
        const ownerId = req.user.id;
        const { id } = req.params;

        const allowedFields = [
            "name",
            "botName",
            "welcomeMessage",
            "avatarUrl",
            "position",
            "primaryColor",
            "accentColor",
            "backgroundColor",
            "openByDefault",
            "showBranding",
            "suggestionTitle",
            "suggestionItems",
        ];

        const update = {};
        for (const key of allowedFields) {
            if (key in req.body) {
                update[key] = req.body[key];
            }
        }

        const widget = await WidgetConfig.findOneAndUpdate(
            { _id: id, owner: ownerId },
            update,
            { new: true }
        );

        if (!widget) {
            return res.status(404).json({
                success: false,
                message: "Widget not found or not owned by user",
            });
        }

        return res.json({
            success: true,
            message: "Widget updated successfully",
            data: widget,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createWidget,
    listWidgets,
    getWidgetById,
    updateWidget,
};

