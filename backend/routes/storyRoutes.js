const express = require("express");
// const multer = require("multer");
const storyController = require("./../controllers/storyController");
const authController = require("./../controllers/authController");

// const upload = multer({ dest: "storage/img/stories" });

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router
  .route("/")
  .get(storyController.getAllStories)
  .post(storyController.createStory);

router.route("/myStories").get(storyController.getMyStories);

router.get("/trending", storyController.getTrending);

router
  .route("/:id")
  .get(storyController.getStory)
  .patch(storyController.updateStory)
  .delete(storyController.deleteStory);

module.exports = router;
