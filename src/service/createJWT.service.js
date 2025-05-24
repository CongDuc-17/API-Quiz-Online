import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createJWT = (userCurrent) => {
  const access_token = jwt.sign(
    {
      id: userCurrent._id,
      username: userCurrent.username,
      email: userCurrent.email,
    },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "1h" }
  );
  const refresh_token = jwt.sign(
    {
      id: userCurrent._id,
      username: userCurrent.username,
      email: userCurrent.email,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "30d",
    }
  );
  return {
    access_token,
    refresh_token,
  };
};
