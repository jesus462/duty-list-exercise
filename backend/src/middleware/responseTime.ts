import { Request, Response, NextFunction } from "express";

/**
 * Express middleware for logging response time and details
 * Logs method, URL, status code, duration, timestamp, user agent, and IP
 */
export const responseTimeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();
  const startDate = new Date();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const timestamp = startDate.toISOString();

    console.log(
      `Response time: ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`,
      {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode.toString(),
        duration: duration.toString(),
        timestamp: timestamp,
        userAgent: req.get("User-Agent") || "unknown",
        ip: req.ip || "unknown",
      }
    );
  });

  next();
};
