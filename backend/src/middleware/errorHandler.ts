import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
}

/**
 * Express error handling middleware
 * Catches all errors and standardizes the response
 * Logs error details including status code, message, path, and method
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  console.error("Error:", {
    statusCode,
    message,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({
    error: message,
  });
};
