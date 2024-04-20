import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide a users name."],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, "Please provide user email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    image: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    location: {
      type: String,
    },
    userIsApproved: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Date,
    },
  },
  {
    timestamps: true, // add automatic timestamps
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
