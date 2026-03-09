import mongoose from "mongoose";
import { Schema } from "mongoose";

const notificationSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: [
            "TASK_ASSIGNED",
            "TASK_UPDATED",
            "TASK_COMPLETED",
            "PROJECT_CREATED",
            "PROJECT_UPDATED",
            "MEMBER_ADDED",
            "MEMBER_REMOVED",
            "COMMENT_ADDED",
            "MENTION",
            "DEADLINE_REMINDER",
            "GENERAL"
        ]
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    actionUrl: {
        type: String,
        trim: true
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project"
    },
    taskId: {
        type: Schema.Types.ObjectId,
        ref: "Task",
    },
    workspaceId: {
        type: Schema.Types.ObjectId,
        ref: "Workspace",
    },
    metadata: {
        type: Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
})

const NotificationModel = mongoose.model("Notification", notificationSchema)
export default NotificationModel