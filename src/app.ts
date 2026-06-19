import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import facultyRoutes from "./routes/faculty.routes";
import officerRoutes from "./routes/officer.routes";
import facultyMARoutes from "./routes/facultyMA.routes";
import batchRoutes from "./routes/batch.routes";
import eligibleStudentRoutes from "./routes/eligibleStudent.routes";

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/faculties", facultyRoutes);
app.use("/api/officers", officerRoutes);
app.use("/api/faculty-ma", facultyMARoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/eligible-students", eligibleStudentRoutes);

export default app;