import { Router } from 'express';
import {getUserId, createUser, updateUser, deleteUserById
} from '../controllers/usuario.controller';
import upload from '../middlewares/upload';

const router = Router();

router.get('/:idUsuario', getUserId);
router.post('/registro', upload.single('fotoPerfil'), createUser);
router.put('/:idUsuario', upload.single('fotoPerfil'), updateUser);
router.delete('/:idUsuario',deleteUserById)

export default router;