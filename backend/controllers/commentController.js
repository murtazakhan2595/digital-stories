const Engagement = require("./../models/engagementModel");
const Comment = require("./../models/commentModel");
const Story = require("./../models/storyModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.createComment = catchAsync(async (req, res, next) => {
  // notes
  /*
        when a user makes a comment then we should
        1. create a doc in comments collection
        2. update count of comments in stories collection
        3. create a doc in engagements section
    */
  const id = req.user.id;
  const { text, story } = req.body;
  const newComment = await Comment.create({
    text,
    user: id,
    story,
  });

  // update count in story
  const storyRes = await Story.findOneAndUpdate(
    { _id: story },
    { $inc: { commentCount: 1 } },
    { new: true }
  );

  // create doc in engagements
  const newEngagement = await Engagement.create({
    action: "comment",
    byUser: id,
    onPost: story,
    forUser: storyRes.postedBy,
  });
  const populatedEngagement = await Engagement.populate(newEngagement, [
    { path: "byUser", select: "name" },
    { path: "forUser", select: "name" },
  ]);
  const message = `${populatedEngagement.byUser.name} posted comment (${newComment.text}) on ${populatedEngagement.forUser.name}`;
  res.status(201).json({
    status: "comment posted successfully",
    message,
  });
});

exports.getCommentsByPostId = catchAsync(async (req, res, next) => {
  const comments = await Comment.find({ story: req.params.id }).populate(
    "user"
  );
  if (!comments) {
    return next(new AppError("No comments Found with this id", 404));
  }

  res.status(201).json({
    status: "success",
    result: comments.length,
    comments,
  });
});
