import { Router } from "express";
import {
    getAllUsers,
    getAllConductores,
    getAllPropietarios,
    getConductorEstatus,
    getVehiculoEstatus,
    getAutorizacionesPropietarios,
    aprobarPropietario,
    rechazarPropietario
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

router.get(
    "/vehiculos",
    authenticateToken,
    authorizeRole(['admin']),
    getVehiculoEstatus

);
router.get(
    "/autorizaciones/propietarios",
    authenticateToken,
    authorizeRole(['admin']),
    getAutorizacionesPropietarios
);
router.put(
    "/autorizaciones/propietarios/:idAutorizacion/aprobar",
    authenticateToken,
    authorizeRole(['admin']),
    aprobarPropietario
);
router.put(
    "/autorizaciones/propietarios/:idAutorizacion/rechazar",
    authenticateToken,
    authorizeRole(['admin']),
    rechazarPropietario
);
export default router;