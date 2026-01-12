import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import User from "../models/user.model.js"
import { registerUserService } from "../services/auth.service.js"
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new apiError(500, 'Something went wrong while generating tokens')
    }
}

export const registerUserController = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body

  if (!email || !password || !name) {
    throw new apiError(400, "All fields are required")
  }

  const { userId, workspaceId } = await registerUserService({ email, name, password })

  return res.status(201).json(
    new apiResponse(201, { userId, workspaceId }, "User registered successfully")
  )
})

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new apiError(400, "Email and password are required")
  }

  const user = await User.findOne({ email })
  if (!user) {
    throw new apiError(401, "Invalid email or password")
  }

  const isPasswordValid = await user.comparePassword(password)
  if (!isPasswordValid) {
    throw new apiError(401, "Invalid email or password")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production"?"none":"lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  }

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new apiResponse(
        200, 
        { user: loggedInUser, accessToken }, 
        "Logged in successfully"
      )
    )
})

export const logOutController = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  }

  return res
    .status(200)
    .clearCookie("refreshToken", cookieOptions)
    .json(
      new apiResponse(200, null, "Logged out successfully")
    )
})

export const refreshAccessTokenController = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new apiError(401, "Unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new apiError(401, "Invalid refresh token")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new apiError(401, "Refresh token is expired or used")
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id)

    return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(
        new apiResponse(
          200,
          { accessToken },
          "Access token refreshed"
        )
      )
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid refresh token")
  }
})
