import { Router } from 'express';
import {getUserId, createUser, updateUser, deleteUserById, deleteMe
} from '../controllers/usuario.controller';
import upload from '../middlewares/upload';

const router = Router();

router.get('/:idUsuario', getUserId);
router.post('/registro', upload.single('fotoPerfil'), createUser);
router.put('/:idUsuario', upload.single('fotoPerfil'), updateUser);
router.delete('/:idUsuario',deleteUserById);
router.delete('/delete/me', deleteMe);

export default router;