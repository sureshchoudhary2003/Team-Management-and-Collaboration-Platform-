import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { apiError } from './utils/apiError.js'

// Routes import
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import workspaceRoutes from './routes/workspace.route.js'
import memberRoutes from './routes/member.route.js'
import projectRoutes from './routes/project.route.js'
import taskRoutes from './routes/task.route.js'
import { verifyJWT } from './middlewares/auth.middleware.js'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use(express.json({ limit: "16kb" }))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public"))

app.use(cookieParser())

// Routes declaration
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", verifyJWT, userRoutes)
app.use("/api/v1/workspace", verifyJWT, workspaceRoutes)
app.use("/api/v1/member", verifyJWT, memberRoutes)
app.use("/api/v1/project", verifyJWT, projectRoutes)
app.use("/api/v1/task", verifyJWT, taskRoutes)

// Global error handler
app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR HANDLER:", err)

    if (err instanceof apiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
        })
    }

    // Fallback for unexpected errors
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message,
    })
})

export { app }
