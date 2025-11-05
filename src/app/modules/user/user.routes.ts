import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createUserZodSchema } from "./user.validatrion";

import { Role } from "./user.interface";

import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);
router.get("/all-users", checkAuth(Role.ADMIN), UserControllers.getAllUser);
router.get(
  "/all-receivers",
  checkAuth(Role.ADMIN, Role.SENDER),
  UserControllers.getAllReceiver
);
router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);

export const UserRoutes = router;
