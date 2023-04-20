const Engagement = require("./../models/engagementModel");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getEngagements = catchAsync(async (req, res, next) => {
  const id = req.user.id;
  // check if the user exists
  const user = await User.exists({ _id: id });
  if (!user) {
    return next(new AppError("User doesnt exist ", 401));
  }
  const yourEngagments = await Engagement.find({
    byUser: id,
    forUser: { $ne: id },
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("byUser onPost forUser");

  const othersEngagements = await Engagement.find({
    forUser: id,
    byUser: { $ne: id },
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("byUser onPost forUser");

  return res.status(200).json({
    result: yourEngagments.length + othersEngagements.length,
    you: yourEngagments,
    others: othersEngagements,
  });
});
