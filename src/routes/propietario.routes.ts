import express from 'express';
import { createPropietario } from '../controllers/propietario.controller';
const router = express.Router();

router.post('/propietarios', createPropietario);

export default router;