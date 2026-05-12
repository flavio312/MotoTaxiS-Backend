import express from 'express';
import { createConductor, getConductor, qrCodeConductor, updateConductor } from '../controllers/conductores.controller';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware';

const router = express.Router();

router.post(
  "/conductor",
  authenticateToken,
  authorizeRole(['conductor']),
  createConductor
);

router.get(
    "/conductor",
    authenticateToken,
    authorizeRole(['admin', 'conductor']),
    getConductor
);
router.put(
    "/conductor",
    authenticateToken,
    authorizeRole(['conductor']),
    updateConductor
);
router.get(
    "/conductor/qr",
    authenticateToken,
    authorizeRole(['conductor']),
    qrCodeConductor
);

export default router;