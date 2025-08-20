import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ParcelRoutes } from "../modules/parcel/parcel.routes";


const router= Router()

const moduleRoutes =[
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/parcels",
        route: ParcelRoutes,
    },
    {
        path: "/auth",
        route: AuthRoutes
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;