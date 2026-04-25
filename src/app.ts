import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import facultyRoutes from "./routes/faculty.routes";


const app: Application = express();

app.use(express.json());
app.use("/api/faculties", facultyRoutes);
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());


app.use("/api/auth", authRoutes);

export default app;