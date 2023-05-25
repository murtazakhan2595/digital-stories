const Engagement = require("./../models/engagementModel");
const Story = require("./../models/storyModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.upVote = catchAsync(async (req, res, next) => {
  const user = req.user.id;
  const post = req.body.post;
  const { postedBy } = await Story.findById(post);
  // check already liked
  const voted = await Engagement.findOne({
    action: "upvote",
    byUser: user,
    onPost: post,
  });
  if (voted) {
    // delete record
    await Engagement.deleteOne({
      action: "upvote",
      byUser: user,
      onPost: post,
    });

    // update story
    await Story.findOneAndUpdate(
      { _id: post },
      { $inc: { upVoteCount: -1 } },
      { new: true }
    );

    return res.status(200).json({ message: "voted successfully" });
  }
  // check already disliked
  const downvoted = await Engagement.findOne({
    action: "downvote",
    byUser: user,
    onPost: post,
  });

  if (downvoted) {
    await Engagement.deleteOne({
      action: "downvote",
      byUser: user,
      onPost: post,
    });

    const newUpvote = new Engagement({
      action: "upvote",
      byUser: user,
      onPost: post,
      forUser: postedBy,
    });

    await newUpvote.save();
    // update story
    await Story.findOneAndUpdate(
      { _id: post },
      { $inc: { downVoteCount: -1 } },
      { new: true }
    );
    await Story.findOneAndUpdate(
      { _id: post },
      { $inc: { upVoteCount: 1 } },
      { new: true }
    );
    return res.status(200).json({ message: "downvoted before, now level" });
  }
  const story = await Story.findOneAndUpdate(
    { _id: post },
    { $inc: { upVoteCount: 1 } },
    { new: true }
  );
  // if not both then add record for upvote
  const newUpvote = new Engagement({
    action: "upvote",
    onPost: post,
    byUser: user,
    forUser: story.postedBy,
  });
  await newUpvote.save();

  return res.status(200).json({ message: "voted successfully" });
});

exports.downVote = catchAsync(async (req, res, next) => {
  const user = req.user.id;
  const post = req.body.post;
  const { postedBy } = await Story.findById(post);
  // check already disliked
  const downvoted = await Engagement.findOne({
    action: "downvote",
    byUser: user,
    onPost: post,
  });

  if (downvoted) {
    // delete record
    await Engagement.deleteOne({
      action: "downvote",
      byUser: user,
      onPost: post,
    });

    // update story
    await Story.findOneAndUpdate(
      { _id: post },
      { $inc: { downVoteCount: -1 } },
      { new: true }
    );

    return res.status(200).json({ message: "voted successfully" });
  }

  // check already liked
  const voted = await Engagement.findOne({
    action: "upvote",
    byUser: user,
    onPost: post,
  });

  if (voted) {
    await Engagement.deleteOne({
      action: "upvote",
      byUser: user,
      onPost: post,
    });

    const newDownvote = new Engagement({
      action: "downvote",
      byUser: user,
      onPost: post,
      forUser: postedBy,
    });

    await newDownvote.save();

    // update story
    await Story.findOneAndUpdate(
      { _id: post },
      { $inc: { upVoteCount: -1 } },
      { new: true }
    );

    await Story.findOneAndUpdate(
      { _id: post },
      { $inc: { downVoteCount: 1 } },
      { new: true }
    );

    return res.status(200).json({ message: "voted successfully" });
  }

  const story = await Story.findOneAndUpdate(
    { _id: post },
    { $inc: { downVoteCount: 1 } },
    { new: true }
  );

  // if not both then add record for upvote
  const newDownvote = new Engagement({
    action: "downvote",
    onPost: post,
    byUser: user,
    forUser: story.postedBy,
  });

  await newDownvote.save();
  return res.status(200).json({ message: "voted successfully" });
});
exports.getVoteStatus = catchAsync(async (req, res, next) => {
  const user = req.user.id;
  const post = req.body.post;
  let voteStatus;
  let upVoted;
  let downVoted;
  upVoted = await Engagement.findOne({
    onPost: post,
    byUser: user,
    action: "upvote",
  });

  downVoted = await Engagement.findOne({
    onPost: post,
    byUser: user,
    action: "downvote",
  });
  if (upVoted) {
    voteStatus = "upvote";
  } else if (downVoted) {
    voteStatus = "downvote";
  } else {
    voteStatus = "novote";
  }

  return res.status(200).json({ voteStatus });
});
