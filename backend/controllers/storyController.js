const Story = require("./../models/storyModel");
// const StoryDTO = require("./../dtos/story-dto");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllStories = catchAsync(async (req, res, next) => {
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
        select: "_id",
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
    const { font, fontColor, caption, postedBy, isPrivate } = req.body;
    newStory = await Story.create({
      mediaType,
      font,
      caption,
      fontColor,
      postedBy,
      isPrivate,
      postedBy: id,
    });
  }
  if (mediaType === "image") {
  }
  if (mediaType === "video") {
  }

  res.status(201).json({
    status: "success",
    data: {
      story: newStory,
    },
  });
});

exports.updateStory = catchAsync(async (req, res, next) => {
  const story = await Story.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
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

exports.deleteStory = catchAsync(async (req, res, next) => {
  const story = await Story.findByIdAndDelete(req.params.id);
  if (!story) {
    return next(new AppError("No story found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
