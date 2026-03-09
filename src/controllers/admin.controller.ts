import {Response, Request} from 'express';
import pool from '../config/db.config';
import {AuthRequest} from '../middlewares/auth.middleware';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query(
            `SELECT 
                u.idUsuario,
                u.nombreUsuario,
                u.rol,
                u.estadoCuenta,
                u.fechaRegistro,
                p.nombre,
                p.apellidoP,
                p.apellidoM,
                p.correoElectronico,
                p.telefono
            FROM Usuarios u
            LEFT JOIN Persona p 
            ON u.idUsuario = p.idPersona`
        );

        res.json(rows);

    } catch (error) {

        console.error(error);
        res.status(500).json({
            message: "Error al obtener usuarios"
        });

    }
};

export const getAllConductores = async (req: Request, res: Response) => {

    try {

        const [rows] = await pool.query(
            `SELECT 
                c.idConductor,
                p.nombre,
                p.apellidoP,
                c.licencia,
                c.licenciaFechaExpedicion,
                c.licenciaFechaVencimiento
            FROM Conductores c
            INNER JOIN Persona p 
            ON c.idConductor = p.idPersona`
        );

        res.json(rows);

    } catch (error) {

        res.status(500).json({
            message: "Error al obtener conductores"
        });

    }
};

export const getAllPropietarios = async (req: Request, res: Response) => {

    try {

        const [rows] = await pool.query(
            `SELECT 
                pr.idPropietario,
                pr.rfc,
                pr.razonSocial,
                p.nombre,
                p.apellidoP
            FROM Propietarios pr
            INNER JOIN Persona p 
            ON pr.idPropietario = p.idPersona`
        );

        res.json(rows);

    } catch (error) {

        res.status(500).json({
            message: "Error al obtener propietarios"
        });

    }
};

export const getConductorEstatus = async (req: Request, res: Response) => {

    try {

        const [rows] = await pool.query(
            `SELECT 
                ce.idCambio,
                ce.idConductor,
                ce.estatus,
                ce.descripcion,
                ce.fecha
            FROM ConductorCambioEstatus ce
            ORDER BY ce.fecha DESC`
        );

        res.json(rows);

    } catch (error) {

        res.status(500).json({
            message: "Error al obtener historial"
        });

    }
};