import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get("/api/test", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "SmartBursary backend working successfully..."
  });
});

export default app;