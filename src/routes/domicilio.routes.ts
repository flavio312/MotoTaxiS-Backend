import express from "express";
import { createDireccion, 
    getDireccionById, 
    createOrigenDestino 
} from "../controllers/direccion.controller";

const router = express.Router();

router.post("/direccion", createDireccion);
router.get("/direccion/:id", getDireccionById);
router.post("/direccion/origen-destino", createOrigenDestino);

export default router;