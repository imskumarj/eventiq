import { verifyToken } from "../utils/jwt.js";

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  // ❌ No header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized: Missing or invalid token format",
    });
  }

  const token = authHeader.split(" ")[1];

  // ❌ Empty token
  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({
      message: "Unauthorized: Invalid token",
    });
  }

  try {
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized: Token verification failed",
      });
    }

    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized: Token expired or invalid",
    });
  }
}