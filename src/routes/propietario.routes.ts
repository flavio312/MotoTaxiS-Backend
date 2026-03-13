import express from 'express';
import { createPropietario } from '../controllers/propietario.controller';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware';
const router = express.Router();

router.post('/propietarios', 
    authenticateToken,
    authorizeRole(['propietario']), 
    createPropietario)
;

export default router;