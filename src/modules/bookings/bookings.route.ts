import { Router } from "express";

// import { vehicleController } from "./vehicles.controller";
import { Roles } from "../auth/auth.constant";
import auth from "../../middleware/auth";
import { bookingController } from "./bookings.controller";

const router = Router();

router.post("/", bookingController.createBooking)
// router.get("/", vehicleController.getAllVehicles);
// router.get("/:vehicleId", vehicleController.getVehicleById);
// router.put("/:vehicleId", auth(Roles.admin), vehicleController.updateVehicle);
// router.delete("/:vehicleId", auth(Roles.admin), vehicleController.deleteVehicle);

export const bookingRoute = router;
