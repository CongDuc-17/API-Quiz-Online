import express from "express";
import AuthController from "./auth.controller.js";
import { validateRegistration } from "../../middleware/validation.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
const router = express.Router();

router.post("/register", validateRegistration, AuthController.register);
router.post("/login", AuthController.login);
router.post("/uploadAvatar", authMiddleware, AuthController.uploadAvatar);
export default router;
