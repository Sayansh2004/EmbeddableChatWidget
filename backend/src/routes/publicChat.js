const express = require("express");
const {
    getPublicWidgetConfig,
    handlePublicMessage,
    publicChatRateLimiter,
} = require("../controllers/publicChatController");

const router = express.Router();

// Public read-only endpoint for configuration
router.get("/widgets/:widgetId", getPublicWidgetConfig);

// Public chat message endpoint with rate limiting applied
router.post("/widgets/:widgetId/messages", publicChatRateLimiter, handlePublicMessage);

module.exports = router;

