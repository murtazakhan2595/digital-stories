const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const storySchema = new mongoose.Schema(
  {
    mediaType: {
      type: String,
      required: [true, "Please Enter Media type"],
      enum: ["text", "image", "video"],
    },
    font: { type: String },
    fontColor: { type: String },
    caption: { type: String },
    image: { type: String, default: "" },
    video: { type: String, default: "" },
    upVoteCount: { type: Number, default: 0 },
    downVoteCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    isPrivate: { type: Boolean, required: true },
    postedBy: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
// storySchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "postedBy",
//   });
//   next();
// });
storySchema.plugin(mongoosePaginate);
const Story = mongoose.model("Story", storySchema, "stories");
module.exports = Story;
