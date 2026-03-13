import { Router } from "express";
import { crearPersona, getMyPersona } from "../controllers/persona.controller";
import { authenticateToken, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

router.post(
    "/persona",
    authenticateToken,
    crearPersona
);

router.get(
    "/persona/me",
    authenticateToken,
    authorizeRole(['pasajero', 'conductor', 'propietario', 'admin']),
    getMyPersona
);

export default router;