import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", userController.createUser);
router.get("/", auth(), userController.getAllUser);
// router.get("/", auth(), userController.getAllUser);

export const useRoute = router;
