const mongoose = require("mongoose");

const { Schema } = mongoose;

const engagementSchema = new Schema(
  {
    action: { type: String, required: true },
    byUser: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    onPost: { type: mongoose.SchemaTypes.ObjectId, ref: "Story" },
    forUser: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
const Engagement = mongoose.model("Engagement", engagementSchema);
module.exports = Engagement;
