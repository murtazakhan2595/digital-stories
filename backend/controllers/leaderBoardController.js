const Story = require("./../models/storyModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getLeaderboard = catchAsync(async (req, res, next) => {
  Story.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "postedBy",
        foreignField: "_id",
        as: "postedBy",
      },
    },
    {
      $addFields: {
        postedBy: { $arrayElemAt: ["$postedBy", 0] },
      },
    },
    {
      $group: {
        _id: "$postedBy._id",
        upVoteCount: { $sum: "$upVoteCount" },
        storiesPosted: { $sum: 1 },
        postedBy: { $first: "$postedBy" },
      },
    },
  ])
    .sort({ storiesPosted: -1, upVoteCount: -1 })
    .exec()
    .then((result) => {
      return res.status(200).json({ result });
    });
  // .exec((err, result) => {
  //   if (err) {
  //     return next(err);
  //   }

  //   //   const leaderboardDto = [];

  //   //   for (let i = 0; i < result.length; i += 1) {
  //   //     const obj = new LeaderboardDTO(result[i]);
  //   //     leaderboardDto.push(obj);
  //   //   }
  //   return res.status(200).json({ result });
  // });
});
