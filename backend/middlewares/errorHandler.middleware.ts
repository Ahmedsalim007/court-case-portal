import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import type { ErrorWithContext } from "../types/Error.js";

export const errorHandler = (
  err: ErrorWithContext,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  const { context = "Operation failed" } = err;

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      success: false,
      message: context,
      error: err.message,
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: `Invalid value for field: ${err.path}`, // path exists here
      error: err.message,
    });
  }

  if ("code" in err && err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Case number already exists",
      error: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
    error: err.message,
  });
};