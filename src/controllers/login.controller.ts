import {Response, Request} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.config';

export const login = async (req: Request, res: Response): Promise<any> => {
    const { nombreUsuario, password } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE nombreUsuario = ?', [nombreUsuario]);
        const user = (rows as any[])[0];

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const secretKey = process.env.JWT_SECRET || '';
        if (!secretKey) {
            return res.status(500).json({ message: "Clave secreta JWT no configurada" });
        }

        const token = jwt.sign({ idUsuario: user.idUsuario, nombreUsuario: user.nombreUsuario, rol: user.rol }, secretKey, {
            expiresIn: '1h'
        });
        
        console.log("Usuario autenticado correctamente:", { idUsuario: user.idUsuario, nombreUsuario: user.nombreUsuario, rol: user.rol });
        res.json({ idUsuario: user.idUsuario, nombreUsuario: user.nombreUsuario, rol: user.rol, token });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ message: "Error al iniciar sesión" });
    }   
};
