import { Router } from "express";

import { ParcelControllers } from "./parcel.controllers";
import { validateRequest } from "../../middleware/validateRequest";
import { createParcelZodSchema } from "./parcel.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/", validateRequest(createParcelZodSchema),checkAuth(Role.SENDER,Role.ADMIN), ParcelControllers.createParcel);
router.patch("/cancel/:id", checkAuth(Role.SENDER, Role.ADMIN), ParcelControllers.cancelParcel);
router.get("/me", checkAuth(Role.SENDER,Role.ADMIN), ParcelControllers.senderParcel);
router.get("/incoming", checkAuth(Role.RECEIVER, Role.ADMIN), ParcelControllers.receiverParcel);
router.patch("/confirm/:id", checkAuth(Role.RECEIVER, Role.ADMIN), ParcelControllers.confirmParcel);
router.get("/:id/status-log", checkAuth(...Object.values(Role)), ParcelControllers.statuslogParcel);
router.get("/admin/parcels", checkAuth( Role.ADMIN), ParcelControllers.allParcels);
export const ParcelRoutes = router;
