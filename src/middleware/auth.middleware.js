import jwt from "jsonwebtoken";
import { decodedJWT } from "../service/decodedJWT.service.js";
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }
  const decoded = decodedJWT(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  req.user = decoded;
  next();
};

// {
//     payload,
//     expired: access_token_expire
//     secret_key=,
//     algorithms="HS256" || "RS256"
// }
