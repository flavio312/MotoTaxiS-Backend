import { Router } from "express";
import {
    crearServicio, obtenerServicios,
    obtenerServicioPorId, cancelarServicio,
    finalizarServicio,
    iniciarServicio,
    aceptarServicio
} from "../controllers/servicio.controller";

const router = Router();

router.post("/viaje", crearServicio);
router.get("/viajes", obtenerServicios);
router.get("/viaje/:id", obtenerServicioPorId);
router.put("/viaje/:id/aceptar", aceptarServicio);
router.put("/viaje/:id/iniciar", iniciarServicio);
router.put("/viaje/:id/finalizar", finalizarServicio);
router.put("/viaje/:id/cancelar", cancelarServicio);

export default router;