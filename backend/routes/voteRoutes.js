const express = require("express");
const voteController = require("./../controllers/voteController");
const authController = require("./../controllers/authController");

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.post("/upvote", voteController.upVote);
router.post("/downvote", voteController.downVote);
router.post("/vote-status", voteController.getVoteStatus);
module.exports = router;
