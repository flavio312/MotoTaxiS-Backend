import { Response, Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.config";


export const getUsers = async (req: Request, res: Response): Promise<any> => {
    try{
        const [rows] = await pool.query('SELECT * FROM Usuarios');
        res.json(rows);
        console.log("Usuarios obtenidos correctamente");
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        res.status(500).json({ message: "Error al obtener los usuarios" });
    }
};

// Obtener usuario por ID
export const getUserId = async (req: Request, res: Response) => {
    try{
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE idUsuario = ?', [req.params.idUsuario]);
        const user = (rows as any[])[0];

        user ? res.json(user) : res.status(404).json({ message: 'User not found' });
        console.log("Usuario encontrado:", user);
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        res.status(500).json({ message: "Error al obtener el usuario" });
    }
};

// Crear usuario
export const createUser = async (req: Request, res: Response): Promise<any> => {
    const { nombreUsuario, password, rol, estadoCuenta = 'activo', fotoPerfil} = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const secretKey = process.env.JWT_SECRET || '';
        if (!secretKey) {
            return res.status(500).json({ message: "Clave secreta JWT no configurada" });
        }

         const [result]: any = await pool.query(
            `INSERT INTO Usuarios 
            (nombreUsuario, password, rol, estadoCuenta, fotoPerfil) 
            VALUES (?, ?, ?, ?, ?)`,
            [nombreUsuario, hashedPassword, rol, estadoCuenta, fotoPerfil]
        );

        const token = jwt.sign({ idUsuario: result.insertId, nombreUsuario, rol }, secretKey, {
            expiresIn: '1h'
        });
        console.log("Usuario creado correctamente:");
        res.status(201).json({ idUsuario: result.insertId,nombreUsuario, token });
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        res.status(500).json({ message: "Error al crear el usuario" });
    }
};


export const updateUser = async (req: Request, res: Response): Promise<any> => {
    const { nombreUsuario, password, rol, estadoCuenta, fotoPerfil } = req.body;
    const { idUsers } = req.params;

    try {

        let query = `
            UPDATE Usuarios 
            SET nombreUsuario = ?, rol = ?, estadoCuenta = ?, fotoPerfil = ?
        `;

        const params: any[] = [nombreUsuario, rol, estadoCuenta, fotoPerfil];

        if (password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            query += `, password_hash = ?`;
            params.push(hashedPassword);
        }

        query += ` WHERE idUsuario = ?`;
        params.push(idUsers);

        const [result]: any = await pool.query(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario actualizado correctamente' });

    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        res.status(500).json({ message: "Error al actualizar el usuario" });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
    const { idUsers } = req.params;

    try {
        await pool.query('DELETE FROM persona WHERE idPersona = ?', [idUsers]);

        const [result]: any = await pool.query('DELETE FROM Usuarios WHERE idUsuario = ?', [idUsers]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log("Usuario eliminado correctamente:", { idUsuario: idUsers });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        res.status(500).json({ message: "Error al eliminar el usuario" });
    }
};
