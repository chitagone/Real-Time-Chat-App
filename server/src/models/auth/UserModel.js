import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      match: [
        /^[\w+.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add password"],
    },
    photo: {
      type: String,
      default:
        "https://res.cloudinary.com/dil9kylo3/image/upload/v1723176952/erlgxgiyvgbfxmizkbfa.png",
    },
    bio: {
      type: String,
      default: "I am a new user",
    },
    role: {
      type: String,
      enum: ["user", "admin", "creator"],
      default: "user",
    },
    friends: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],

    friendRequests: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],

    lastSeen: {
      type: Date,
      default: Date.now(),
    },

    theme: {
      type: String,
      default: "light",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, minimize: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  // Check if the password is not modified
  if (!this.isModified("password")) {
    return next();
  }

  // Generate salt
  const salt = await bcrypt.genSalt(10);

  // Hash password with the salt
  this.password = await bcrypt.hash(this.password, salt);

  // Call next() middleware
  next();
});

const User = mongoose.model("User", UserSchema);

export default User;
