import UserModel from "../models/user.model.js"
import { apiError } from "../utils/apiError.js"

export const getCurrentUserService = async (userId) => {
  const user = await UserModel.findById(userId)
    .populate("currentWorkspace")
    .select("-password")

  if (!user) {
    throw new apiError(400, "User not found")
  }

  return {
    user,
  }
} 