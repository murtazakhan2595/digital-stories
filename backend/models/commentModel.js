const mongoose = require("mongoose");

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Please write comment!"],
    },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    story: { type: mongoose.SchemaTypes.ObjectId, ref: "Story" },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
