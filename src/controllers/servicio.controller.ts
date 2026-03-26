import { Request, Response } from "express";
import { getIO } from "../services/socket.service";
import { Servicios } from "../models/servicio.models";
import { AuthRequest } from "../middlewares/auth.middleware";
import pool from "../config/db.config";

// Crear servicio
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

// Obtener todos los servicios
export const obtenerServicios = async (_req: Request, res: Response) => {
    try {
        const [rows] = await pool.query("SELECT * FROM Servicios");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener servicios", error });
    }
};

// Obtener servicio por ID
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


// Asignar conductor automaticamente
export const asignarConductorAutomatico = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // 1. Obtener coordenadas del servicio
        const [servicio]: any = await pool.query(`
            SELECT s.idServicio, d.latitud, d.longitud
            FROM Servicios s
            JOIN Direccion d ON s.idDireccionOrigen = d.idDireccion
            WHERE s.idServicio = ?
        `, [id]);

        if (servicio.length === 0) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }

        const { latitud, longitud } = servicio[0];

        // 2. Buscar conductor más cercano disponible
        const [conductores]: any = await pool.query(`
            SELECT 
            cu.idConductor,
            (6371 * ACOS(
                COS(RADIANS(?)) * COS(RADIANS(cu.latitud)) *
                COS(RADIANS(cu.longitud) - RADIANS(?)) +
                SIN(RADIANS(?)) * SIN(RADIANS(cu.latitud))
            )) AS distancia
            FROM ConductorUbicacion cu
            WHERE cu.disponible = TRUE
            HAVING distancia < 5
            ORDER BY distancia ASC
            LIMIT 1
        `, [latitud, longitud, latitud]);

        if (conductores.length === 0) {
            return res.status(404).json({ message: "No hay conductores disponibles" });
        }

        const conductor = conductores[0];

        // 3. Asignar servicio
        await pool.query(`
            UPDATE Servicios 
            SET idConductor = ?, idVehiculo = ?, estado = 'aceptado'
            WHERE idServicio = ?
        `, [conductor.idConductor, conductor.idVehiculo, id]);

        // 4. Marcar conductor como ocupado
        await pool.query(`
            UPDATE Conductores SET disponible = FALSE WHERE idConductor = ?
        `, [conductor.idConductor]);

        // 5. Historial
        await pool.query(`
            INSERT INTO HistorialEstadoServicio (idServicio, estado, fechaHora)
            VALUES (?, 'aceptado', NOW())
        `, [id]);

        res.json({
            message: "Conductor asignado automáticamente",
            conductor
        });

    } catch (error) {
        res.status(500).json({ message: "Error en asignación automática", error });
    }
};


export const actualizarUbicacionConductor = async (req: Request, res: Response) => {
    try {
        const { idConductor, latitud, longitud } = req.body;

        await pool.query(`
            INSERT INTO ConductorUbicacion (idConductor, latitud, longitud)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
                latitud = VALUES(latitud),
                longitud = VALUES(longitud)
        `, [idConductor, latitud, longitud]);

        res.json({ message: "Ubicación actualizada" });

    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};

export const actualizarUbicacionSocket = async (idConductor: number, latitud: number, longitud: number) => {
    await pool.query(`
        INSERT INTO ConductorUbicacion (idConductor, latitud, longitud)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
            latitud = VALUES(latitud),
            longitud = VALUES(longitud)
    `, [idConductor, latitud, longitud]);
};

export const aceptarServicioSocket = async (
    idServicio: number, 
    idConductor: number, 
    socket: any) => {
    const [servicio]: any = await pool.query(
        "SELECT estado FROM Servicios WHERE idServicio = ?",
        [idServicio]
    );

    if (servicio.length === 0) {
        return { ok: false, message: "Servicio no encontrado" };
    }
    if (servicio[0].estado !== "solicitado") {
        return socket.emit("errorServicio", "Ya fue tomado");
    }

    await pool.query(
        `UPDATE Servicios
         SET estado = 'aceptado', idConductor = ?
         WHERE idServicio = ?`,
        [idConductor, idServicio]
    );

    await pool.query(
        `INSERT INTO HistorialEstadoServicio (idServicio, estado, fechaHora)
         VALUES (?, 'aceptado', NOW())`,
        [idServicio]
    );

    const io = getIO();

    // Notificar a TODOS que ya se tomó
    io.emit("servicioTomado", idServicio);

    socket.emit("servicioAceptado", idServicio);
    return { ok: true, message: "Servicio aceptado" };
};
