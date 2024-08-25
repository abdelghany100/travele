const mongoose = require("mongoose");
const Joi = require("joi");
const { User } = require("./User");

// Post Schema
const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tags: { type: [String], default: [] },
    image: {
      type: Object,
      default: {
        url: "",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// populate for this post
PostSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "postId",
  localField: "_id",
});

PostSchema.pre(/^find/, function (next) {
  this.populate("user", [
    "-password",
    "-profilePhoto",
    "-createdAt",
    "-updatedAt",
    "-__v",
  ]);
  next();
});

// validate Create post
function validateCreatePost(obj) {
  const Schema = Joi.object({
    title: Joi.string().trim().min(2).max(200).required(),
    description: Joi.string().trim().min(10).required(),
    tags: Joi.array(),
  });
  return Schema.validate(obj);
}

// validate Update post
function validateUpdatePost(obj) {
  const Schema = Joi.object({
    title: Joi.string().trim().min(2).max(200),
    description: Joi.string().trim().min(10),
  });
  return Schema.validate(obj);
}
// Post Model
const Post = mongoose.model("Post", PostSchema);

module.exports = {
  Post,
  validateCreatePost,
  validateUpdatePost,
};
