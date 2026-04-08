import { Request, Response } from 'express';
import pool from '../config/db.config';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createPropietario = async (req: AuthRequest, res: Response): Promise<any> => {
    const idPropietario = req.user?.idUsuario;
    const { rfc, razonSocial } = req.body;

    let connection;

    const validarRfc = (rfc: string): boolean => {
        const regexRFC = /^([A-ZÑ&]{3,4})(\d{6})([A-Z\d]{3})$/;
        return regexRFC.test(rfc);
    };

    /* const validarRFCenSAT = async (rfc: string): Promise<boolean> => {
        try {
            const response = await fetch(`https://api-sat-validacion.com/rfc/${rfc}`);
            if (!response.ok) throw new Error("Error consultando servicio SAT");
            const data = await response.json();
            return data.valido;
        } catch (error) {
            console.error("Error en validación SAT:", error);
            return false;
        }
    }; */

    try {
        if (!validarRfc(rfc)) {
            return res.status(400).json({ message: "El RFC no tiene un formato válido" });
        }

        /* const existeEnSAT = await validarRFCenSAT(rfc);
        if (!existeEnSAT) {
            return res.status(400).json({ message: "El RFC no está registrado en el SAT" });
        } */

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [usuario]: any = await connection.query(
            `SELECT rol FROM Usuarios WHERE idUsuario = ?`,
            [idPropietario]
        );

        if (usuario.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (usuario[0].rol !== 'propietario') {
            return res.status(403).json({ message: "El usuario no tiene rol propietario" });
        }
         // Verificar si ya existe autorización
        const [autorizacion]: any = await connection.query(
            `SELECT idAutorizacion, estado FROM Autorizacion WHERE idUsuario = ? ORDER BY fechaSolicitud DESC LIMIT 1`,
            [idPropietario]
        );
        if (autorizacion.length > 0 && autorizacion[0].estado === 'pendiente') {
            return res.status(400).json({ message: "Ya existe una solicitud pendiente" });
        }

        const [exists]: any = await connection.query(
            `SELECT idPropietario FROM Propietarios WHERE idPropietario = ?`,
            [idPropietario]
        );

        if (exists.length > 0) {
            return res.status(400).json({ message: "El propietario ya está registrado" });
        }

        await connection.query(
            `INSERT INTO Propietarios (idPropietario, rfc, razonSocial)
             VALUES (?, ?, ?)`,
            [idPropietario, rfc, razonSocial]
        );
        // Crear solicitud de autorización
        await connection.query(
            `INSERT INTO Autorizacion (idUsuario, estado, fechaSolicitud)
             VALUES (?, 'pendiente', NOW())`,
            [idPropietario]
        );

        await connection.commit();

        res.status(201).json({ message: "Solicitud de propietario creada, pendiente de autorización"});

    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ message: "Error al crear el propietario" });
    } finally {
        if (connection) connection.release();
    }
};

export const getPropietarios = async (req: Request, res: Response) => {

    const [rows]: any = await pool.query(
        `SELECT p.idPropietario, p.rfc, p.razonSocial, u.nombre, u.email
        FROM Propietarios p
        JOIN Usuarios u ON p.idPropietario = u.idUsuario`
    );
    res.json(rows);
};