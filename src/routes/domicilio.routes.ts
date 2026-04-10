import express from "express";
import {
    crearDireccion,
    createDireccionGoogle,
    getDireccionById,
    createOrigenDestino,
    asignarDireccionUsuario
} from "../controllers/direccion.controller";

const router = express.Router();

// Crear una dirección
router.post("/direccion", crearDireccion);
router.post("/direccionG", createDireccionGoogle);

// Obtener dirección por ID
router.get("/direccion/:id", getDireccionById);

// Crear origen y destino
router.post("/direccion/origen-destino", createOrigenDestino);

// Asociar dirección a usuario
router.post("/usuario-direccion", asignarDireccionUsuario);

export default router;