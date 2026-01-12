import { asyncHandler } from "../utils/asyncHandler.js"
import { apiResponse } from "../utils/apiResponse.js"
import {
  changeRoleSchema,
  createWorkspaceSchema,
  workspaceIdSchema,
  updateWorkspaceSchema,
} from "../validation/workspace.validation.js"
import {
  changeMemberRoleService,
  createWorkspaceService,
  deleteWorkspaceService,
  getAllWorkspacesUserIsMemberService,
  getWorkspaceAnalyticsService,
  getWorkspaceByIdService,
  getWorkspaceMembersService,
  updateWorkspaceByIdService,
} from "../services/workspace.service.js";
import { getMemberRoleInWorkspace } from "../services/member.service.js";
import { Permissions } from "../enums/role.enum.js";
import { roleGuard } from "../utils/roleGuard.js";

export const createWorkspaceController = asyncHandler(
  async (req, res) => {
    const body = createWorkspaceSchema.parse(req.body);

    const userId = req.user?._id
    const { workspace } = await createWorkspaceService(userId, body)

    return res
      .status(201)
      .json(new apiResponse(201, { workspace }, "Workspace created successfully"))
  }
);

// Controller: Get all workspaces the user is part of

export const getAllWorkspacesUserIsMemberController = asyncHandler(
  async (req, res) => {
    const userId = req.user?._id;

    const { workspaces } = await getAllWorkspacesUserIsMemberService(userId)

    return res
      .status(200)
      .json(new apiResponse(200, { workspaces }, "User workspaces fetched successfully"))
  }
);

export const getWorkspaceByIdController = asyncHandler(
  async (req, res) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;

    await getMemberRoleInWorkspace(userId, workspaceId);

    const { workspace } = await getWorkspaceByIdService(workspaceId)

    return res
      .status(200)
      .json(new apiResponse(200, { workspace }, "Workspace fetched successfully"))
  }
);

export const getWorkspaceMembersController = asyncHandler(
  async (req, res) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { members, roles } = await getWorkspaceMembersService(workspaceId)

    return res
      .status(200)
      .json(new apiResponse(200, { members, roles }, "Workspace members retrieved successfully"))
  }
);

export const getWorkspaceAnalyticsController = asyncHandler(
  async (req, res) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { analytics } = await getWorkspaceAnalyticsService(workspaceId)

    return res
      .status(200)
      .json(new apiResponse(200, { analytics }, "Workspace analytics retrieved successfully"))
  }
);

export const changeWorkspaceMemberRoleController = asyncHandler(
  async (req, res) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const { memberId, roleId } = changeRoleSchema.parse(req.body);

    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.CHANGE_MEMBER_ROLE]);

    const { member } = await changeMemberRoleService(
      workspaceId,
      memberId,
      roleId
    )

    return res
      .status(200)
      .json(new apiResponse(200, { member }, "Member Role changed successfully"))
  }
);

export const updateWorkspaceByIdController = asyncHandler(
  async (req, res) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const { name, description } = updateWorkspaceSchema.parse(req.body);

    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.EDIT_WORKSPACE]);

    const { workspace } = await updateWorkspaceByIdService(
      workspaceId,
      name,
      description
    )

    return res
      .status(200)
      .json(new apiResponse(200, { workspace }, "Workspace updated successfully"))
  }
);

export const deleteWorkspaceByIdController = asyncHandler(
  async (req, res) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);

    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.DELETE_WORKSPACE]);

    const { currentWorkspace } = await deleteWorkspaceService(
      workspaceId,
      userId
    )

    return res
      .status(200)
      .json(new apiResponse(200, { currentWorkspace }, "Workspace deleted successfully"))
  }
); 