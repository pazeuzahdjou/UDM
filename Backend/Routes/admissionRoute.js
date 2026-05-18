import express from "express";

import {
  createAdmission,
  getLastAdmission,
} from "../controllers/admissionController.js";

const router = express.Router();

router.post("/", createAdmission);

router.get("/last", getLastAdmission);

export default router;