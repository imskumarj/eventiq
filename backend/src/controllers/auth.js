import * as authService from "../services/auth.js";

export async function registerUser(req, res, next) {
  try {
    const result = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}