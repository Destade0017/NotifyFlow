import { Router } from "express";
import {
  createAppointment,
  getAppointments,
  cancelAppointment,
} from "../controllers/appointment.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate); // Protect all appointment routes

router.post("/", createAppointment);
router.get("/", getAppointments);
router.patch("/:id/cancel", cancelAppointment);

export default router;