import { Router } from "express";
import {
    getAllUsers,
    getAllConductores,
    getAllPropietarios,
    getConductorEstatus
} from "../controllers/admin.controller";

import { authenticateToken, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

router.get(
    "/usuarios",
    authenticateToken,
    authorizeRole(['admin']),
    getAllUsers
);

router.get(
    "/conductores",
    authenticateToken,
    authorizeRole(['admin']),
    getAllConductores
);

router.get(
    "/propietarios",
    authenticateToken,
    authorizeRole(['admin']),
    getAllPropietarios
);

router.get(
    "/conductores/estatus",
    authenticateToken,
    authorizeRole(['admin']),
    getConductorEstatus
);

export default router;