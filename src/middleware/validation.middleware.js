import { REGEX_PATTERNS } from "../constants/regex.constants.js";

export const validateRegistration = (req, res, next) => {
  const { email, password, username } = req.body;

  // Validate email
  if (!email || !REGEX_PATTERNS.EMAIL.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format. Please enter a valid email address.",
    });
  }

  // Validate password
  if (!password || !REGEX_PATTERNS.PASSWORD.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
    });
  }

  // Validate username
  if (!username || !REGEX_PATTERNS.USERNAME.test(username)) {
    return res.status(400).json({
      success: false,
      message:
        "Username must be between 3-20 characters and can only contain letters, numbers, and underscores",
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  next();
};
