import express from 'express';
import { getMe, login} from '../controllers/login.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/login', login);
router.get('/me',authenticateToken, getMe);

export default router;