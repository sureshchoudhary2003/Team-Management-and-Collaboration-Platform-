import { ErrorCodeEnum } from "../enums/error-code.enum.js"
import { Roles } from "../enums/role.enum.js"
import MemberModel from "../models/member.model.js"
import RoleModel from "../models/roles-permission.model.js"
import WorkspaceModel from "../models/workspace.model.js"
import { apiError } from "../utils/apiError.js"

export const getMemberRoleInWorkspace = async (
  userId,
  workspaceId
) => {
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new apiError(404, "Workspace not found");
  }

  const member = await MemberModel.findOne({
    userId,
    workspaceId,
  }).populate("role")

  if (!member) {
    throw new apiError(
      403,
      "You are not a member of this workspace"
    )
  }

  const roleName = member.role?.name;

  return { role: roleName };
};

export const joinWorkspaceByInviteService = async (
  userId,
  inviteCode
) => {
  // Find workspace by invite code
  const workspace = await WorkspaceModel.findOne({ inviteCode }).exec();
  if (!workspace) {
    throw new apiError(404, "Invalid invite code or workspace not found");
  }

  // Check if user is already a member
  const existingMember = await MemberModel.findOne({
    userId,
    workspaceId: workspace._id,
  }).exec();

  if (existingMember) {
    throw new apiError(400, "You are already a member of this workspace");
  }

  const role = await RoleModel.findOne({ name: Roles.MEMBER });

  if (!role) {
    throw new apiError(404, "Role not found");
  }

  // Add user to workspace as a member
  const newMember = new MemberModel({
    userId,
    workspaceId: workspace._id,
    role: role._id,
  });
  await newMember.save();

  return { workspaceId: workspace._id, role: role.name };
}; 