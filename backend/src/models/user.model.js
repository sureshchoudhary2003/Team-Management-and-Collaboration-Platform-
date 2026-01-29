import mongoose, { Schema } from "mongoose"
import { compareValue, hashValue } from "../utils/bcrypt.js"
import jwt from 'jsonwebtoken'

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, select: true },
    profilePicture: {
      type: String,
      default: null,
    },
    currentWorkspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
    refreshToken: {
      type: String,
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
)

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    if (this.password) {
      this.password = await hashValue(this.password)
    }
  }
  next()
})

userSchema.methods.omitPassword = function () {
  const userObject = this.toObject()
  delete userObject.password
  return userObject
}

userSchema.methods.comparePassword = async function (value) {
  return compareValue(value, this.password)
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET || "team_sync_access_token_secret_key_123456789",
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
    }
  )
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET || "team_sync_refresh_token_secret_key_987654321",
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d",
    }
  )
}

const UserModel = mongoose.model("User", userSchema)
export default UserModel; 