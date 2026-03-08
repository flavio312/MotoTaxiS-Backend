import { Router } from "express";
import { crearPersona, getMyPersona } from "../controllers/persona.controller";
import { authenticateToken, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

// Solo usuarios autenticados pueden crear su persona
router.post(
    "/persona",
    authenticateToken,
    crearPersona
);

// Solo pasajeros pueden ver su perfil
router.get(
    "/persona/me",
    authenticateToken,
    authorizeRole(['pasajero', 'conductor', 'propietario', 'administrador']),
    getMyPersona
);

export default router;