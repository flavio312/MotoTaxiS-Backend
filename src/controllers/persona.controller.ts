import { Response, Request } from "express";
import pool from "../config/db.config";
import { AuthRequest } from "../middlewares/auth.middleware";

export const crearPersona = async (req: AuthRequest, res: Response): Promise<any> => {
    const idUsuario = req.user.idUsuario;

    const {
        nombre,
        apellidoP,
        apellidoM,
        idSexo,
        correoElectronico,
        telefono,
        fechaNacimiento
    } = req.body;

    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correoElectronico)) {
            return res.status(400).json({ message: "Correo electrónico inválido" });
        }

        const [exists]: any = await pool.query(
            "SELECT idPersona FROM Persona WHERE idPersona = ?",
            [idUsuario]
        );

        if (exists.length > 0) {
            return res.status(400).json({ message: "La persona ya existe" });
        }

        const [emailExists]: any = await pool.query(
            "SELECT idPersona FROM Persona WHERE correoElectronico = ?",
            [correoElectronico]
        );

        if (emailExists.length > 0) {
            return res.status(400).json({ message: "El correo electrónico ya está registrado" });
        }

        await pool.query(
            `INSERT INTO Persona
            (idPersona, nombre, apellidoP, apellidoM, idSexo, correoElectronico, telefono, fechaNacimiento)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [idUsuario, nombre, apellidoP, apellidoM, idSexo, correoElectronico, telefono, fechaNacimiento]
        );

        res.status(201).json({ message: "Persona creada correctamente" });

    } catch (error) {
        res.status(500).json({ message: "Error al crear persona" });
        console.error("Error:", error);
    }
};

export const getMyPersona = async (req: AuthRequest, res: Response): Promise<any> => {

    const idUsuario = req.user.idUsuario;

    try {

        const [rows]: any = await pool.query(
            `SELECT 
                p.idPersona,
                p.nombre,
                p.apellidoP,
                p.apellidoM,
                p.idSexo,
                s.sexo,
                p.correoElectronico,
                p.telefono,
                p.fechaNacimiento
            FROM Persona p
            INNER JOIN Sexo s ON p.idSexo = s.idSexo
            WHERE p.idPersona = ?`,
            [idUsuario]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Perfil no encontrado" });
        }

        res.json(rows[0]);

    } catch (error) {
        res.status(500).json({ message: "Error al obtener perfil" });
    }
};

export const updatePersona = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { 
        correoElectronico,
        telefono,
    } = req.body;

    try {

        const [result]: any = await pool.query(
            `UPDATE Persona SET
                correoElectronico = ?,
                telefono = ?,
            WHERE idPersona = ?`,
            [correoElectronico, telefono, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Persona no encontrada" });
        }

        res.json({ message: "Persona actualizada correctamente" });

    } catch (error) {
        res.status(500).json({ message: "Error al actualizar persona" });
    }
};