const mongoose = require("mongoose");


const conversationSchema = new mongoose.Schema(
    {
        widget: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WidgetConfig",
            required: true,
            index: true,
        },
        sessionId: {
            type: String,
            required: true,
            index: true,
        },
        startedAt: {
            type: Date,
            default: Date.now,
        },
        lastMessageAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Conversation", conversationSchema);

