import express from "express";
import { authenticateToken, authorizeRole } from "../middlewares/auth.middleware";
import { crearVehiculo,
    getMyVehiculos, 
    updateVehiculo, 
    changeVehiculoStatus } 
from "../controllers/vehiculo.controller";

const router = express.Router();

router.post(
    "/vehiculos",
    authenticateToken,
    authorizeRole(['propietario']),
    crearVehiculo
);

router.get(
    "/vehiculos",
    authenticateToken,
    authorizeRole(['propietario']),
    getMyVehiculos
);

router.put(
    "/vehiculos/:idVehiculo",
    authenticateToken,
    authorizeRole(['propietario']),
    updateVehiculo
);

router.patch(
    "/vehiculos/:idVehiculo/estatus",
    authenticateToken,
    authorizeRole(['propietario']),
    changeVehiculoStatus
);

export default router;