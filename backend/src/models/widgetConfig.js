const mongoose = require("mongoose");


const widgetConfigSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        botName: {
            type: String,
            default: "Chatbot",
            trim: true,
        },
        welcomeMessage: {
            type: String,
            default: "Hi! How can I help you today?",
        },
        avatarUrl: {
            type: String,
            default: "",
        },
        position: {
            type: String,
            enum: ["bottom-right", "bottom-left"],
            default: "bottom-right",
        },
        primaryColor: {
            type: String,
            default: "#570DF8", // DaisyUI primary
        },
        accentColor: {
            type: String,
            default: "#F000B8",
        },
        backgroundColor: {
            type: String,
            default: "#FFFFFF",
        },
        openByDefault: {
            type: Boolean,
            default: false,
        },
        showBranding: {
            type: Boolean,
            default: true,
        },
      
        suggestionTitle: {
            type: String,
            default: "",
        },
        suggestionItems: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("WidgetConfig", widgetConfigSchema);

