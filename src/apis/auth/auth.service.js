import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import User from "../../models/User.js";
import { Op } from "sequelize";
import { createJWT } from "../../service/createJWT.service.js";
import { uploadAvatar } from "../../service/uploadImage.service.js";

dotenv.config();

class AuthService {
  //REGISTER USER
  async register(username, password, email) {
    try {
      // Kiểm tra user đã tồn tại
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ username: username }, { email: email }],
        },
      });

      if (existingUser) {
        return { success: false, message: "User already exists" };
      }

      // Hash password và tạo user mới
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        username,
        password_hash: hashedPassword,
        email,
      });

      return {
        success: true,
        message: "User registered successfully",
        userId: newUser.id,
      };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, message: "Internal server error" };
    }
  }

  //LOGIN USER
  async login(username, password) {
    try {
      const user = await User.findOne({
        where: { username },
      });
      if (!user) {
        return { success: false, message: "User not found" };
      }
      // Kiểm tra password
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (!isPasswordValid) {
        return { success: false, message: "Invalid password" };
      }
      const { access_token, refresh_token } = createJWT(user);
      return {
        success: true,
        message: "Login successful",
        access_token,
        refresh_token,
      };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Internal server error" };
    }
  }
  //UPLOAD AVATAR
  async uploadAvatar(username, linkAvatar) {
    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return { success: false, message: "User not found" };
      }
      const avatarUrl = await uploadAvatar(linkAvatar); // Trả về URL
      if (!avatarUrl) {
        return { success: false, message: "Upload avatar failed" };
      }
      await user.update({ link_avatar: avatarUrl });
      return {
        success: true,
        message: "Avatar uploaded successfully",
        avatar: avatarUrl,
      };
    } catch (error) {
      console.error("Upload avatar error:", error);
      return { success: false, message: "Internal server error" };
    }
  }
}

export default new AuthService();
