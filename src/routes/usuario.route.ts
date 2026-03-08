import express from 'express';
import { getUsers, getUserId, createUser, updateUser, deleteUser } from '../controllers/usuario.controller';

const router = express.Router();

router.get('/', getUsers);
router.get('/:idUsuario', getUserId);
router.post('/registro', createUser);
router.put('/:idUsuario', updateUser);
router.delete('/:idUsers', deleteUser);

export default router;