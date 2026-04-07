import { Response, Request } from "express";
import pool from "../config/db.config";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createConductor = async (req: AuthRequest, res: Response): Promise<any> => {
   
    const idUsuario = req.user?.idUsuario;
    const rol = req.user?.rol;

    const {
        licencia,
        licenciaFechaExpedicion,
        licenciaFechaVencimiento,
        estatus,
        descripcion,
        jornada
    } = req.body;

    const connection = await pool.getConnection();
    const hoy = new Date();
    const fechaVencimiento = new Date(licenciaFechaVencimiento);

    if (fechaVencimiento < hoy) {
        return res.status(400).json({
            message: "La licencia ya está vencida"
        });
    }
    try {

        await connection.beginTransaction();
        //insertar Conductor
        await connection.query(
            `INSERT INTO Conductores
            (idConductor, licencia, licenciaFechaExpedicion, licenciaFechaVencimiento)
            VALUES (?, ?, ?, ?)`,
            [
                idUsuario,
                licencia,
                licenciaFechaExpedicion,
                licenciaFechaVencimiento
            ]
        );
        //insertar cambio de estatus
        await connection.query(
            `INSERT INTO ConductorCambioEstatus
            (idConductor, estatus, descripcion, fecha)
            VALUES (?, ?, ?, NOW())`,
            [
                idUsuario,
                estatus,
                descripcion
            ]
        );

        if (jornada) {
            let idConductorHorario: number | null = null;

            if (jornada.horario) {
                const [horarioResult] = await connection.query(
                    `INSERT INTO ConductorHorario (dias, horas) VALUES (?, ?)`,
                    [jornada.horario.dias, jornada.horario.horas]
                );

                // Recuperar el ID autogenerado
                idConductorHorario = (horarioResult as any).insertId;
            }

            await connection.query(
                `INSERT INTO ConductorJornada
                (idConductor, idConductorHorario, fechaRegistro, fechaInicio, fechaFin)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    idUsuario,
                    idConductorHorario,
                    jornada.fechaRegistro,
                    jornada.fechaInicio,
                    jornada.fechaFin
                ]
            );

            if(jornada.horario){
                await connection.query(
                    `INSERT INTO ConductorHorario
                    (dias, horas)
                    VALUES (?, ?)`,
                    [
                        jornada.horario.dias,
                        jornada.horario.horas
                    ]
                );
            }
        }

        await connection.commit();

        res.status(201).json({
            message: "Conductor registrado correctamente"
        });

    } catch (error) {

        await connection.rollback();
        console.error(error);

        res.status(500).json({
            message: "Error al registrar conductor"
        });

    } finally {

        connection.release();

    }
};

export const getConductor = async (req: AuthRequest, res: Response) => {

    const idUsuario = req.user?.idUsuario;

    const [rows]: any = await pool.query(
        `SELECT *
        FROM Conductores
        WHERE idConductor = ?`,
        [idUsuario]
    );

    res.json(rows[0]);
};

export const updateConductor = async (req: AuthRequest, res: Response) => {

    const idUsuario = req.user?.idUsuario;
    const rol = req.user?.rol;

    const {
        licencia,
        licenciaFechaExpedicion,
        licenciaFechaVencimiento
    } = req.body;

    await pool.query(
        `UPDATE Conductores
        SET licencia = ?, licenciaFechaExpedicion = ?, licenciaFechaVencimiento = ?
        WHERE idConductor = ?`,
        [
            licencia,
            licenciaFechaExpedicion,
            licenciaFechaVencimiento,
            idUsuario
        ]
    );

    res.json({ message: "Conductor actualizado" });
};