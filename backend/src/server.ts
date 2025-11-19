import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import { responseTimeMiddleware } from "./middleware/responseTime";
import { setupControlledShutdown } from "./utils/setupControlledShutdown";
import { setupDatabase } from "./utils/setupDatabase";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseTimeMiddleware);

app.get("/health", (_req: express.Request, res: express.Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);
setupDatabase();

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

setupControlledShutdown(server);
export default app;
