import { Router } from 'express';
import { getUsers, 
    getUserId, createUser, 
    updateUser, deleteUser 
} from '../controllers/usuario.controller';
import upload from '../middlewares/upload';

const router = Router();

router.get('/', getUsers);
router.get('/:idUsuario', getUserId);
router.post('/registro', upload.single('fotoPerfil'), createUser);
router.put('/:idUsuario', upload.any(), updateUser);
router.delete('/:idUsers', deleteUser);

export default router;