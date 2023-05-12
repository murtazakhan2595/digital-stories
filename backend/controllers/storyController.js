const Jimp = require("jimp");
const path = require("path");
const Story = require("./../models/storyModel");
// const StoryDTO = require("./../dtos/story-dto");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Engagement = require("./../models/engagementModel");
const Comment = require("./../models/commentModel");

exports.getAllStories = catchAsync(async (req, res, next) => {
  console.log("in getallstories");
  const page = parseInt(req.query.page, 10) || 1;
  const limit = 7;
  let stories;
  const totalStories = await Story.countDocuments({ isPrivate: false });
  stories = await Story.paginate(
    { isPrivate: false },
    {
      page,
      limit,
      populate: {
        path: "postedBy",
        select: "_id avatarPath name",
      },
      sort: { createdAt: -1 },
    }
  );
  if (!stories) {
    return next();
  }
  let { docs } = stories;
  // const storiesDto = [];
  // for (let i = 0; i < stories.docs.length; i += 1) {
  //   const obj = new StoryDTO(stories.docs[i]);
  //   storiesDto.push(obj);
  // }
  // console.log(storiesDto);

  return res.status(200).json({
    status: "success",
    result: totalStories,
    data: {
      stories: docs,
      totalPages: stories.totalPages,
      page: stories.page,
      hasNextPage: stories.hasNextPage,
      hasPrevPage: stories.hasPrevPage,
    },
  });
});

exports.getMyStories = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const { id } = req.user;
  const limit = 7;
  let stories;
  if (id) {
    stories = await Story.paginate(
      { postedBy: id },
      {
        page,
        limit,
        populate: {
          path: "postedBy",
        },
        sort: { createdAt: -1 },
      }
    );
  } else {
    return next(new AppError("Please login first to see your stories", 401));
  }

  if (!stories) {
    return next();
  }
  let { docs } = stories;

  return res.status(200).json({
    status: "success",
    result: docs.length,
    data: {
      stories: docs,
      totalPages: stories.totalPages,
      page: stories.page,
      hasNextPage: stories.hasNextPage,
      hasPrevPage: stories.hasPrevPage,
    },
  });
});

exports.getStory = catchAsync(async (req, res, next) => {
  const story = await Story.findById(req.params.id).populate("postedBy");
  if (!story) {
    return next(new AppError("No story found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      story,
    },
  });
});

exports.getTrending = catchAsync(async (req, res, next) => {
  const stories = await Story.find({ isPrivate: false })
    .sort({
      upVoteCount: -1,
      commentCount: -1,
    })
    .limit(20)
    .populate("postedBy");
  return res.status(200).json({
    status: "success",
    result: stories.length,
    data: {
      stories,
    },
  });
});

exports.createStory = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const { mediaType } = req.body;
  let newStory;
  if (mediaType === "text") {
    const { font, fontColor, caption, isPrivate } = req.body;
    newStory = await Story.create({
      mediaType,
      font,
      caption,
      fontColor,
      isPrivate,
      postedBy: id,
    });
  }
  if (mediaType === "image") {
    const { caption, isPrivate, image } = req.body;

    // preprocess the image
    const buffer = Buffer.from(
      image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );

    const imgPath = `${Date.now()}-${Math.round(Math.random() * 100000)}.png`;
    const jimpRes = await Jimp.read(buffer);
    jimpRes
      //   .resize(200, Jimp.AUTO) i want to keep original res intact
      .write(path.resolve(__dirname, `../storage/${imgPath}`));
    newStory = await Story.create({
      mediaType,
      caption,
      image: `http://localhost:5544/storage/${imgPath}`,
      postedBy: id,
      isPrivate,
    });
  }
  if (mediaType === "video") {
    const { caption, isPrivate, postedBy } = req.body;
    newStory = await Story.create({
      mediaType,
      caption,
      video: `http://localhost:5544/storage/${req.file.filename}`,
      postedBy: id,
      isPrivate,
    });
  }

  res.status(201).json({
    status: "success",
    data: {
      story: newStory,
    },
  });
});

exports.deleteStory = catchAsync(async (req, res, next) => {
  console.log("delete story");
  const story = await Story.findByIdAndDelete(req.params.id);
  if (!story) {
    return next(new AppError("No story found with that ID", 404));
  }
  await Comment.deleteMany({ story: req.params.id });
  await Engagement.deleteMany({
    onPost: req.params.id,
  });
  console.log("delete story end");
  res.status(204).json({
    status: "success",
    data: null,
  });
});
// exports.updateStory = catchAsync(async (req, res, next) => {
//   const story = await Story.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!story) {
//     return next(new AppError("No story found with that ID", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       story,
//     },
//   });
// });

exports.update = catchAsync(async (req, res, next) => {
  const { mediaType, storyId } = req.body;
  if (mediaType === "text") {
    const { font, fontColor, caption } = req.body;

    await Story.updateOne(
      { _id: storyId },
      {
        $set: {
          mediaType,
          font,
          caption,
          fontColor,
        },
      }
    );
  }

  if (mediaType === "image") {
    const { caption, image } = req.body;

    if (image === "") {
      await Story.updateOne(
        { _id: storyId },
        {
          $set: {
            mediaType,
            caption,
          },
        }
      );
    } else {
      // preprocess the image

      const buffer = Buffer.from(
        image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );

      const imgPath = `${Date.now()}-${Math.round(Math.random() * 100000)}.png`;

      const jimpRes = await Jimp.read(buffer);
      jimpRes
        //   .resize(200, Jimp.AUTO) i want to keep original res intact
        .write(path.resolve(__dirname, `../storage/${imgPath}`));

      await Story.updateOne(
        { _id: storyId },
        {
          $set: {
            mediaType,
            caption,
            image: `http://localhost:5544/storage/${imgPath}`,
          },
        }
      );
    }
  }

  if (mediaType === "video") {
    const { caption } = req.body;
    console.log(caption, mediaType, storyId);

    // if video middleware sends a filename then video should be updated
    // otherwise only caption should be updated
    if (req.file) {
      await Story.updateOne(
        { _id: storyId },
        {
          $set: {
            mediaType,
            caption,
            video: `http://localhost:5544/storage/${req.file.filename}`,
          },
        }
      );
    } else {
      await Story.updateOne(
        { _id: storyId },
        {
          $set: {
            mediaType,
            caption,
          },
        }
      );
    }
  }

  return res.status(200).json({ message: "story updated successfully" });
});

exports.updateAccessMode = catchAsync(async (req, res, next) => {
  const { storyId, isPrivate } = req.body;
  await Story.updateOne(
    { _id: storyId },
    {
      $set: {
        isPrivate,
      },
    }
  );

  return res
    .status(200)
    .json({ message: "story access mode updated successfully" });
});
