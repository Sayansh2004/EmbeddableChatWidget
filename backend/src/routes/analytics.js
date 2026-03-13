const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { getWidgetAnalytics } = require("../controllers/analyticsController");

const router = express.Router();

router.use(requireAuth);

router.get("/widgets/:id", getWidgetAnalytics);

module.exports = router;

