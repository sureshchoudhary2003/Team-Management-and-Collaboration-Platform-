import { Router } from "express"
import {
  loginController,
  logOutController,
  registerUserController,
  refreshAccessTokenController,
} from "../controllers/auth.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const authRoutes = Router()

authRoutes.post("/register", registerUserController)
authRoutes.post("/login", loginController)
authRoutes.post("/logout", verifyJWT, logOutController)
authRoutes.post("/refresh-token", refreshAccessTokenController)

export default authRoutes 