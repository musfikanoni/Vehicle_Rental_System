import { Router } from "express";

import { vehicleController } from "./vehicles.controller";
import { Roles } from "../auth/auth.constant";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth(Roles.admin), vehicleController.createVehicle)
// router.get("/", auth(Roles.admin), userController.getAllUser);
// router.get("/", auth(), userController.getAllUser);

export const vehicleRoute = router;
