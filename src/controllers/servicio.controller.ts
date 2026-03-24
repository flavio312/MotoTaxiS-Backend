import { Request, Response } from "express";
import { Servicios } from "../models/servicio.models";
import { AuthRequest } from "../middlewares/auth.middleware";
import pool from "../config/db.config";

// 📌 Crear servicio
export const crearServicio = async (req: Request, res: Response) => {
    try {
        const {
            idPasajero,
            idConductor,
            idVehiculo,
            idTipoServicio,
            idDireccionOrigen,
            idDireccionDestino,
            fechaSolicitud,
            distancia,
            estado
        } = req.body;

        const [result]: any = await pool.query(
            `INSERT INTO Servicios 
            (idPasajero, idConductor, idVehiculo, idTipoServicio, idDireccionOrigen, idDireccionDestino, fechaSolicitud, distanciaKm, estado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                idPasajero,
                idConductor,
                idVehiculo,
                idTipoServicio,
                idDireccionOrigen,
                idDireccionDestino,
                fechaSolicitud,
                distancia,
                estado || 'solicitado'
            ]
        );

        res.status(201).json({
            message: "Servicio creado",
            idServicio: result.insertId
        });

    } catch (error) {
        res.status(500).json({ message: "Error al crear servicio", error });
    }
};

// 📌 Obtener todos los servicios
export const obtenerServicios = async (_req: Request, res: Response) => {
    try {
        const [rows] = await pool.query("SELECT * FROM Servicios");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener servicios", error });
    }
};

// 📌 Obtener servicio por ID
export const obtenerServicioPorId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const [rows]: any = await pool.query(
            "SELECT * FROM Servicios WHERE idServicio = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }

        res.json(rows[0]);

    } catch (error) {
        res.status(500).json({ message: "Error al obtener servicio", error });
    }
};

// Aceptar servicio
export const aceptarServicio = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { idConductor, idVehiculo } = req.body;

        // Validar estado actual
        const [servicio]: any = await pool.query(
            "SELECT estado FROM Servicios WHERE idServicio = ?",
            [id]
        );

        if (servicio.length === 0) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }

        if (servicio[0].estado !== 'solicitado') {
            return res.status(400).json({ message: "El servicio no puede ser aceptado" });
        }

        // Actualizar
        await pool.query(
            `UPDATE Servicios 
             SET estado = 'aceptado', idConductor = ?, idVehiculo = ?
             WHERE idServicio = ?`,
            [idConductor, idVehiculo, id]
        );

        // Historial
        await pool.query(
            `INSERT INTO HistorialEstadoServicio (idServicio, estado, fechaHora)
             VALUES (?, 'aceptado', NOW())`,
            [id]
        );

        res.json({ message: "Servicio aceptado" });

    } catch (error) {
        res.status(500).json({ message: "Error al aceptar servicio", error });
    }
};

export const iniciarServicio = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const [servicio]: any = await pool.query(
            "SELECT estado FROM Servicios WHERE idServicio = ?",
            [id]
        );

        if (servicio[0].estado !== 'aceptado') {
            return res.status(400).json({ message: "No se puede iniciar" });
        }

        await pool.query(
            `UPDATE Servicios 
             SET estado = 'en_curso', fechaInicio = NOW()
             WHERE idServicio = ?`,
            [id]
        );

        await pool.query(
            `INSERT INTO HistorialEstadoServicio (idServicio, estado, fechaHora)
             VALUES (?, 'en_curso', NOW())`,
            [id]
        );

        res.json({ message: "Servicio iniciado" });

    } catch (error) {
        res.status(500).json({ message: "Error al iniciar servicio", error });
    }
};

export const finalizarServicio = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { distancia } = req.body;

        const [servicio]: any = await pool.query(
            "SELECT estado FROM Servicios WHERE idServicio = ?",
            [id]
        );

        if (servicio[0].estado !== 'en_curso') {
            return res.status(400).json({ message: "No se puede finalizar" });
        }

        await pool.query(
            `UPDATE Servicios 
             SET estado = 'completado', fechaFin = NOW(), distanciaKm = ?
             WHERE idServicio = ?`,
            [distancia, id]
        );

        await pool.query(
            `INSERT INTO HistorialEstadoServicio (idServicio, estado, fechaHora)
             VALUES (?, 'completado', NOW())`,
            [id]
        );

        res.json({ message: "Servicio completado" });

    } catch (error) {
        res.status(500).json({ message: "Error al finalizar servicio", error });
    }
};

// Cancelar servicio
export const cancelarServicio = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await pool.query(
            `UPDATE Servicios 
             SET estado = 'cancelado'
             WHERE idServicio = ?`,
            [id]
        );

        await pool.query(
            `INSERT INTO HistorialEstadoServicio (idServicio, estado, fechaHora)
             VALUES (?, 'cancelado', NOW())`,
            [id]
        );

        res.json({ message: "Servicio cancelado" });

    } catch (error) {
        res.status(500).json({ message: "Error al cancelar servicio", error });
    }
};