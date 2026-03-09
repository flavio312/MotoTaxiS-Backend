import express from 'express';
import { createPropietario } from '../controllers/propietario.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
const router = express.Router();

router.post('/propietarios', authenticateToken, createPropietario);

export default router;