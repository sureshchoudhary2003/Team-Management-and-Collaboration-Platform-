import { asyncHandler } from "../utils/asyncHandler.js"
import { apiResponse } from "../utils/apiResponse.js"
import { getCurrentUserService } from "../services/user.service.js"

export const getCurrentUserController = asyncHandler(async (req, res) => {
  const userId = req.user?._id

  const { user } = await getCurrentUserService(userId)

  return res.status(200).json(
    new apiResponse(200, { user }, "User fetched successfully")
  )
}) 