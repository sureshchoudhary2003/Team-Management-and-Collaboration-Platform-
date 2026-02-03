import mongoose from "mongoose"
import UserModel from "../models/user.model.js"
import WorkspaceModel from "../models/workspace.model.js"
import RoleModel from "../models/roles-permission.model.js"
import { Roles } from "../enums/role.enum.js"
import { apiError } from "../utils/apiError.js"
import MemberModel from "../models/member.model.js"

export const registerUserService = async (body) => {
  const { email, name, password } = body
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const existingUser = await UserModel.findOne({ email }).session(session)
    if (existingUser) {
      throw new apiError(400, "Email already exists")
    }

    const user = new UserModel({
      email,
      name,
      password,
    })
    await user.save({ session })

    const workspace = new WorkspaceModel({
      name: `My Workspace`,
      description: `Workspace created for ${user.name}`,
      owner: user._id,
    })
    await workspace.save({ session })

    const ownerRole = await RoleModel.findOne({
      name: Roles.OWNER,
    }).session(session)

    if (!ownerRole) {
      throw new apiError(404, "Owner role not found")
    }

    const member = new MemberModel({
      userId: user._id,
      workspaceId: workspace._id,
      role: ownerRole._id,
      joinedAt: new Date(),
    })
    await member.save({ session })

    user.currentWorkspace = workspace._id
    await user.save({ session })

    await session.commitTransaction()
    session.endSession()

    return {
      userId: user._id,
      workspaceId: workspace._id,
    }
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
} 