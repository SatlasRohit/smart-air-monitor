import express from "express";
import { addData, getData, getStationHistory } from "../controllers/dataController.js";

const router = express.Router();

router.post("/", addData);
router.get("/", getData);

/* 🔥 THIS MUST EXIST */
router.get("/history/:station", getStationHistory);

export default router;