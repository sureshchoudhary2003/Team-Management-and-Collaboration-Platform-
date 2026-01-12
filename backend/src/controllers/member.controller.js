import { asyncHandler } from "../utils/asyncHandler.js"
import { apiResponse } from "../utils/apiResponse.js"
import { z } from "zod"
import { joinWorkspaceByInviteService } from "../services/member.service.js"

export const joinWorkspaceController = asyncHandler(
  async (req, res) => {
    const inviteCode = z.string().parse(req.params.inviteCode);
    const userId = req.user?._id;

    const { workspaceId, role } = await joinWorkspaceByInviteService(
      userId,
      inviteCode
    )

    return res
      .status(200)
      .json(
        new apiResponse(200, { workspaceId, role }, "Successfully joined the workspace")
      )
  }
); 