import { asyncHandler } from "../utils/asyncHandler.js"
import { apiResponse } from "../utils/apiResponse.js"
import {
  createTaskSchema,
  taskIdSchema,
  updateTaskSchema,
} from "../validation/task.validation.js";
import { projectIdSchema } from "../validation/project.validation.js";
import { workspaceIdSchema } from "../validation/workspace.validation.js";
import { Permissions } from "../enums/role.enum.js";
import { getMemberRoleInWorkspace } from "../services/member.service.js";
import { roleGuard } from "../utils/roleGuard.js";
import {
  createTaskService,
  deleteTaskService,
  getAllTasksService,
  getTaskByIdService,
  updateTaskService,
} from "../services/task.service.js"

export const createTaskController = asyncHandler(
  async (req, res) => {
    const userId = req.user?._id;

    const body = createTaskSchema.parse(req.body);
    const projectId = projectIdSchema.parse(req.params.projectId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.CREATE_TASK]);

    const { task } = await createTaskService(
      workspaceId,
      projectId,
      userId,
      body
    )

    return res
      .status(200)
      .json(new apiResponse(200, { task }, "Task created successfully"))
  }
);

export const updateTaskController = asyncHandler(
  async (req, res) => {
    const userId = req.user?._id;

    const body = updateTaskSchema.parse(req.body);

    const taskId = taskIdSchema.parse(req.params.id);
    const projectId = projectIdSchema.parse(req.params.projectId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.EDIT_TASK]);

    const { updatedTask } = await updateTaskService(
      workspaceId,
      projectId,
      taskId,
      body
    )

    return res
      .status(200)
      .json(new apiResponse(200, { task: updatedTask }, "Task updated successfully"))
  }
);

export const getAllTasksController = asyncHandler(
  async (req, res) => {
    const userId = req.user?._id;

    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const filters = {
      status: req.query.status && req.query.status !== 'undefined'
        ? req.query.status.split(",")
        : undefined,
      priority: req.query.priority && req.query.priority !== 'undefined'
        ? req.query.priority.split(",")
        : undefined,
      assignedTo: req.query.assignedTo && req.query.assignedTo !== 'undefined'
        ? req.query.assignedTo.split(",").filter(id => id && id !== 'undefined')
        : undefined,
      keyword: req.query.keyword && req.query.keyword !== 'undefined' ? req.query.keyword : undefined,
      dueDate:
        req.query.dueDate && req.query.dueDate !== 'undefined' && !isNaN(new Date(req.query.dueDate))
          ? new Date(req.query.dueDate)
          : undefined,
    }

    if (req.query.projectId && req.query.projectId !== 'undefined') {
      filters.projectId = req.query.projectId
    }

    const pagination = {
      pageSize: parseInt(req.query.pageSize) || 10,
      pageNumber: parseInt(req.query.pageNumber) || 1,
    };

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const result = await getAllTasksService(workspaceId, filters, pagination)

    return res
      .status(200)
      .json(new apiResponse(200, result, "All tasks fetched successfully"))
  }
);

export const getTaskByIdController = asyncHandler(
  async (req, res) => {
    const userId = req.user?._id;

    const taskId = taskIdSchema.parse(req.params.id);
    const projectId = projectIdSchema.parse(req.params.projectId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const task = await getTaskByIdService(workspaceId, projectId, taskId)

    return res
      .status(200)
      .json(new apiResponse(200, { task }, "Task fetched successfully"))
  }
);

export const deleteTaskController = asyncHandler(
  async (req, res) => {
    const userId = req.user?._id;

    const taskId = taskIdSchema.parse(req.params.id);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.DELETE_TASK]);

    await deleteTaskService(workspaceId, taskId)

    return res
      .status(200)
      .json(new apiResponse(200, {}, "Task deleted successfully"))
  }
); 