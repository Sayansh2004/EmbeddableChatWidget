const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const {
    createWidget,
    listWidgets,
    getWidgetById,
    updateWidget,
} = require("../controllers/widgetsController");

const router = express.Router();

// All widget management routes require an authenticated dashboard user.
router.use(requireAuth);

router.get("/", listWidgets);
router.post("/", createWidget);
router.get("/:id", getWidgetById);
router.put("/:id", updateWidget);

module.exports = router;

