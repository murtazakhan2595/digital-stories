const express = require("express");
const storyController = require("./../controllers/storyController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, storyController.getAllStories)
  .post(authController.protect, storyController.createStory);

router
  .route("/myStories")
  .get(authController.protect, storyController.getMyStories);

router
  .route("/:id")
  .get(authController.protect, storyController.getStory)
  .patch(authController.protect, storyController.updateStory)
  .delete(authController.protect, storyController.deleteStory);

module.exports = router;
