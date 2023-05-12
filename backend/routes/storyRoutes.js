const express = require("express");
const storyController = require("./../controllers/storyController");
const authController = require("./../controllers/authController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage");
  },

  // using original name to keep file extension
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: {
    fieldSize: "25mb",
  },
});

const router = express.Router();

// Protect all routes after this middleware

router.use(authController.protect);
router
  .route("/")
  .get(storyController.getAllStories)
  .post(storyController.createStory)
  .put(storyController.update);

router.post("/video", upload.single("video"), storyController.createStory);
router.route("/myStories").get(storyController.getMyStories);

router.get("/trending", storyController.getTrending);
router.put("/mode", storyController.updateAccessMode);
router.put("/video", upload.single("video"), storyController.update);

router
  .route("/:id")
  .get(storyController.getStory)
  .delete(storyController.deleteStory);

module.exports = router;
