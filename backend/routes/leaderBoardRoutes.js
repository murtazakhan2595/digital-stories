const express = require("express");
const leaderboardController = require("./../controllers/leaderBoardController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.get("/", authController.protect, leaderboardController.getLeaderboard);
module.exports = router;
