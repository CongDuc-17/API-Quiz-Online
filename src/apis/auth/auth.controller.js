import AuthService from "./auth.service.js";
import { REGEX_PATTERNS } from "../../constants/regex.constants.js";

class AuthController {
  async register(req, res) {
    try {
      const { username, password, email } = req.body;

      const result = await AuthService.register(username, password, email);
      if (result.success) {
        return res.status(201).json(result);
      }
      return res.status(400).json(result);
    } catch (error) {
      console.error("Register controller error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = await AuthService.login(username, password);
      if (result.success) {
        return res.status(200).json(result);
      }
      return res.status(401).json(result);
    } catch (error) {
      console.error("Login controller error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async uploadAvatar(req, res) {
    try {
      const username = req.user.username;
      const { filePath } = req.body;
      const result = await AuthService.uploadAvatar(username, filePath);
      if (result.success) {
        return res.status(200).json(result);
      }
      return res.status(400).json(result);
    } catch (error) {
      console.error("Upload avatar controller error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

export default new AuthController();
