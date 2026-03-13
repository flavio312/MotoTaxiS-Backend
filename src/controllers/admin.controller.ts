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


export const getVehiculoEstatus = async (req: Request, res: Response) => {

    try {

        const [rows] = await pool.query(
            `SELECT 
                v.idVehiculo,
                v.inmatriculacion,
                v.color,
                v.fechaAdquisicion,
                vm.descripcion AS modelo,

                ve.estatus,
                ve.descripcion AS descripcionEstatus,
                ve.fechaInicio,

                p.nombre,
                p.apellidoP,
                p.apellidoM

            FROM Vehiculo v

            LEFT JOIN VehiculoModelo vm
                ON v.idModelo = vm.idModelo

            LEFT JOIN VehiculoEstatus ve
                ON v.idVehiculo = ve.idVehiculo
                AND ve.fechaFin IS NULL

            LEFT JOIN PropietarioVehiculo pv
                ON v.idVehiculo = pv.idVehiculo
                AND pv.fechaFin IS NULL

            LEFT JOIN Persona p
                ON pv.idPropietario = p.idPersona`
        );

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error al obtener vehículos"
        });

    }

};  

// Obtener todas las solicitudes de autorización de propietarios
export const getAutorizacionesPropietarios = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query(
            `SELECT 
                a.idAutorizacion,
                a.idUsuario,
                a.estado,
                a.fechaSolicitud,
                a.fechaResolucion,
                u.nombreUsuario,
                p.nombre,
                p.apellidoP,
                p.apellidoM
            FROM Autorizacion a
            INNER JOIN Usuarios u ON a.idUsuario = u.idUsuario
            INNER JOIN Persona p ON u.idUsuario = p.idPersona
            ORDER BY a.fechaSolicitud DESC`
        );

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener autorizaciones" });
    }
};

// Aprobar solicitud de propietario
export const aprobarPropietario = async (req: Request, res: Response) => {
    const { idAutorizacion } = req.params;
    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Verificar autorización
        const [rows]: any = await connection.query(
            `SELECT idUsuario, estado FROM Autorizacion WHERE idAutorizacion = ?`,
            [idAutorizacion]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Autorización no encontrada" });
        }

        if (rows[0].estado !== 'pendiente') {
            return res.status(400).json({ message: "La solicitud ya fue procesada" });
        }

        const idUsuario = rows[0].idUsuario;

        // Actualizar autorización
        await connection.query(
            `UPDATE Autorizacion 
             SET estado = 'aceptado', fechaResolucion = NOW() 
             WHERE idAutorizacion = ?`,
            [idAutorizacion]
        );

        // Aquí decides si quieres marcar algo en Usuarios (ej. estadoCuenta activo)
        await connection.query(
            `UPDATE Usuarios SET estadoCuenta = 'activo' WHERE idUsuario = ?`,
            [idUsuario]
        );

        await connection.commit();
        res.json({ message: "Propietario aprobado exitosamente" });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ message: "Error al aprobar propietario" });
    } finally {
        if (connection) connection.release();
    }
};

// Rechazar solicitud de propietario
export const rechazarPropietario = async (req: Request, res: Response) => {
    const { idAutorizacion } = req.params;
    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [rows]: any = await connection.query(
            `SELECT idUsuario, estado FROM Autorizacion WHERE idAutorizacion = ?`,
            [idAutorizacion]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Autorización no encontrada" });
        }

        if (rows[0].estado !== 'pendiente') {
            return res.status(400).json({ message: "La solicitud ya fue procesada" });
        }

        const idUsuario = rows[0].idUsuario;

        await connection.query(
            `UPDATE Autorizacion 
             SET estado = 'rechazado', fechaResolucion = NOW() 
             WHERE idAutorizacion = ?`,
            [idAutorizacion]
        );

        // Opcional: suspender cuenta del usuario
        await connection.query(
            `UPDATE Usuarios SET estadoCuenta = 'suspendido' WHERE idUsuario = ?`,
            [idUsuario]
        );

        await connection.commit();
        res.json({ message: "Propietario rechazado exitosamente" });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ message: "Error al rechazar propietario" });
    } finally {
        if (connection) connection.release();
    }
};