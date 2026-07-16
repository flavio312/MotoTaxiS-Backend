import { Response, Request } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middlewares/auth.middleware";
import pool from "../config/db.config";
import { cloudinaryService } from "../services/cloudinary.service";

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
    const { nombreUsuario, password, rol, estadoCuenta = 'activo'} = req.body;
    let fotoPerfil: string | null = null;
    let fotoPerfilPublicId: string | null = null;

    if (req.file) {
        const uploadResult = await cloudinaryService.uploadImage(
            req.file.buffer,
            req.file.originalname,
            {
                folder: 'usuarios'
            }
        );

        fotoPerfil = uploadResult.url;
        fotoPerfilPublicId = uploadResult.publicId;
    }

    try {

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const secretKey = process.env.JWT_SECRET || '';
        if (!secretKey) {
            return res.status(500).json({ message: "Clave secreta JWT no configurada" });
        }

         const [result]: any = await pool.query(
            `INSERT INTO Usuarios 
            (nombreUsuario, password, rol, estadoCuenta, fotoPerfil, fotoPerfilPublicId) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [nombreUsuario, hashedPassword, rol, estadoCuenta, fotoPerfil, fotoPerfilPublicId]
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
    const { nombreUsuario, password, rol, estadoCuenta } = req.body;
    const { idUsers } = req.params;
    let fotoPerfil: string | null = null;
    let fotoPerfilPublicId: string | null = null;

    try {
        if (req.file) {
            // Obtener usuario actual
            const [rows]: any = await pool.query(
                "SELECT fotoPerfilPublicId FROM Usuarios WHERE idUsuario = ?",
                [idUsers]
            );

            const user = rows[0];

            // Eliminar imagen anterior
            if (user?.fotoPerfilPublicId) {
                await cloudinaryService.deleteImage(user.fotoPerfilPublicId);
            }

            // Subir nueva
            const uploadResult = await cloudinaryService.uploadImage(
                req.file.buffer,
                req.file.originalname
            );

            fotoPerfil = uploadResult.url;
            fotoPerfilPublicId = uploadResult.publicId;
        }
        let query = `
            UPDATE Usuarios 
            SET nombreUsuario = ?, rol = ?, estadoCuenta = ?, fotoPerfil = ?, fotoPerfilPublicId = ?
        `;

        const params: any[] = [nombreUsuario, rol, estadoCuenta, fotoPerfil, fotoPerfilPublicId];

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

export const deleteUserById = async (req: Request, res: Response): Promise<any> => {
    const { idUsuario } = req.params;

    try {
        await pool.query('DELETE FROM persona WHERE idPersona = ?', [idUsuario]);

        const [result]: any = await pool.query('DELETE FROM Usuarios WHERE idUsuario = ?', [idUsuario]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        console.log("Usuario eliminado correctamente:", { idUsuario: idUsuario });
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        res.status(500).json({ message: "Error al eliminar el usuario" });
    }
};


export const deleteMe = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const idUsuario = req.user?.idUsuario;
        if (!idUsuario) {
            return res.status(401).json({ message: "No autenticado" });
        }

        // Si tienes tabla persona relacionada
        await pool.query("DELETE FROM persona WHERE idPersona = ?", [idUsuario]);

        // Eliminar usuario
        const [result]: any = await pool.query("DELETE FROM Usuarios WHERE idUsuario = ?", [idUsuario]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        console.log("Usuario eliminado correctamente:", { idUsuario });
        return res.json({ message: "Tu cuenta ha sido eliminada exitosamente" });
    } catch (error) {
        console.error("Error al eliminar la cuenta:", error);
        return res.status(500).json({ message: "Error al eliminar la cuenta" });
    }
};
