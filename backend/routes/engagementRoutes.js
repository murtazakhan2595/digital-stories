const express = require("express");
const engagementController = require("./../controllers/engagementController");
const authController = require("./../controllers/authController");

const router = express.Router();
router.get("/", authController.protect, engagementController.getEngagements);

module.exports = router;
