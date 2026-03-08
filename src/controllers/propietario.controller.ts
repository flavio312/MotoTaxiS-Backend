import { Request, Response } from 'express';
import pool from '../config/db.config';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createPropietario = async (req: AuthRequest, res: Response): Promise<any> => {

    const idUsuario = req.user.idUsuario;
    const { rfc, razonSocial } = req.body;

    let connection;

    try {

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [usuario]: any = await connection.query(
            `SELECT rol FROM Usuarios WHERE idUsuario = ?`,
            [idUsuario]
        );

        if (usuario.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (usuario[0].rol !== 'propietario') {
            return res.status(403).json({ message: "El usuario no tiene rol propietario" });
        }

        const [exists]: any = await connection.query(
            `SELECT idPropietario FROM Propietarios WHERE idPropietario = ?`,
            [idUsuario]
        );

        if (exists.length > 0) {
            return res.status(400).json({ message: "El propietario ya está registrado" });
        }

        // 3️⃣ Insertar propietario
        await connection.query(
            `INSERT INTO Propietarios
            (idPropietario, rfc, razonSocial)
            VALUES (?, ?, ?)`,
            [
                idUsuario,
                rfc,
                razonSocial
            ]
        );

        await connection.commit();

        res.status(201).json({
            message: "Propietario creado exitosamente"
        });

    } catch (error) {

        if (connection) await connection.rollback();

        console.error(error);

        res.status(500).json({
            message: "Error al crear el propietario"
        });

    } finally {

        if (connection) connection.release();

    }
};