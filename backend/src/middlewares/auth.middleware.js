import User from '../models/user.model.js'
import { apiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken'

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const accessToken = req.headers.authorization?.replace("Bearer ", "")
  const { refreshToken } = req.cookies

  if (!accessToken && !refreshToken) {
    throw new apiError(401, "Unauthorized request: No tokens provided")
  }

  try {
    if (!accessToken) {
        throw new Error("Access token missing")
    }

    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

    if (!user) {
      throw new apiError(401, "Invalid Access Token: User not found")
    }

    req.user = user
    return next()

  } catch (error) {
    if (!refreshToken) {
        throw new apiError(401, "Session expired. Please log in again.")
    }
  }

  try {
    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedRefreshToken?._id)

    if (!user) {
        throw new apiError(401, "Invalid Refresh Token: User not found")
    }

    if (user.refreshToken !== refreshToken) {
      throw new apiError(401, "Refresh token is expired or has been used")
    }
    
    const newAccessToken = user.generateAccessToken()
    const newRefreshToken = user.generateRefreshToken()

    const cookieOptions = {
      httpOnly: true,
      secure: true, 
      sameSite: "none",
    }

    res.setHeader('X-Access-Token', newAccessToken)
    res.cookie("refreshToken", newRefreshToken, cookieOptions)

    req.user = user
    next()
    
  } catch (refreshError) {
    throw new apiError(401, refreshError.message || "Session expired. Please log in again.")
  }
})
