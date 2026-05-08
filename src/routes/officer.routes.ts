import express from "express";
import { createOfficer } from "../controllers/officer.controller";

const router = express.Router();

router.post("/", createOfficer);

export default router;