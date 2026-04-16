import { Router } from 'express';
import { getUsers, 
    getUserId, createUser, 
    updateUser
} from '../controllers/usuario.controller';
import upload from '../middlewares/upload';

const router = Router();

router.get('/', getUsers);
router.get('/:idUsuario', getUserId);
router.post('/registro', upload.single('fotoPerfil'), createUser);
router.put('/:idUsuario', upload.single('fotoPerfil'), updateUser);

export default router;