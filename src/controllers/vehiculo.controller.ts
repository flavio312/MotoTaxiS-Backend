import { Response } from "express";
import pool from "../config/db.config";
import { AuthRequest } from "../middlewares/auth.middleware";

export const crearVehiculo = async (req: AuthRequest, res: Response): Promise<any> => {

    const idPropietario = req.user?.idUsuario;

    const {
        inmatriculacion,
        idModelo,
        color,
        fechaAdquisicion,
        estatus,
        descripcion
    } = req.body;

    let connection;

    try {

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1️⃣ Crear vehículo
        const [result]: any = await connection.query(
            `INSERT INTO Vehiculo
            (inmatriculacion, idModelo,color, fechaAdquisicion)
            VALUES (?, ?, ?, ?)`,
            [
                inmatriculacion,
                idModelo,
                color,
                fechaAdquisicion
            ]
        );

        const idVehiculo = result.insertId;

        await connection.query(
            `INSERT INTO PropietarioVehiculo
            (idPropietario, idVehiculo, fechaInicio)
            VALUES (?, ?, NOW())`,
            [
                idPropietario,
                idVehiculo
            ]
        );

        await connection.query(
            `INSERT INTO VehiculoEstatus
            (idVehiculo, estatus, fechaInicio, descripcion)
            VALUES (?, ?, NOW(), ?)`,
            [
                idVehiculo,
                estatus || 'activo',
                descripcion || 'Registro inicial'
            ]
        );

        await connection.commit();

        res.status(201).json({
            message: "Vehículo registrado correctamente",
            idVehiculo
        });

    } catch (error) {

        if (connection) await connection.rollback();

        console.error(error);

        res.status(500).json({
            message: "Error al registrar vehículo"
        });

    } finally {

        if (connection) connection.release();

    }
};

export const getMyVehiculos = async (req: AuthRequest, res: Response) => {

    const idPropietario = req.user?.idUsuario;

    try {

        const [rows] = await pool.query(
            `SELECT 
                v.idVehiculo,
                v.inmatriculacion,
                v.idModelo,
                vm.descripcion AS modelo,
                v.fechaAdquisicion
            FROM Vehiculos v
            INNER JOIN PropietarioVehiculo pv 
                ON v.idVehiculo = pv.idVehiculo
            LEFT JOIN VehiculoModelo vm
                ON v.idModelo = vm.idModelo
            WHERE pv.idPropietario = ?
            AND pv.fechaFin IS NULL`,
            [idPropietario]
        );

        res.json(rows);

    } catch (error) {

        res.status(500).json({
            message: "Error al obtener vehículos"
        });

    }
};

export const updateVehiculo = async (req: AuthRequest, res: Response) => {

    const { idVehiculo } = req.params;
    const { inmatriculacion, idModelo, fechaAdquisicion } = req.body;

    try {

        await pool.query(
            `UPDATE Vehiculos
            SET inmatriculacion = ?, idModelo = ?, fechaAdquisicion = ?
            WHERE idVehiculo = ?`,
            [
                inmatriculacion,
                idModelo,
                fechaAdquisicion,
                idVehiculo
            ]
        );

        res.json({
            message: "Vehículo actualizado correctamente"
        });

    } catch (error) {

        res.status(500).json({
            message: "Error al actualizar vehículo"
        });

    }
};

export const changeVehiculoStatus = async (req: AuthRequest, res: Response) => {

    const { idVehiculo } = req.params;
    const { estatus, descripcion } = req.body;

    let connection;

    try {

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // cerrar estatus actual
        await connection.query(
            `UPDATE VehiculoEstatus
            SET fechaFin = NOW()
            WHERE idVehiculo = ?
            AND fechaFin IS NULL`,
            [idVehiculo]
        );

        // crear nuevo estatus
        await connection.query(
            `INSERT INTO VehiculoEstatus
            (idVehiculo, estatus, fechaInicio, descripcion)
            VALUES (?, ?, NOW(), ?)`,
            [
                idVehiculo,
                estatus,
                descripcion
            ]
        );

        await connection.commit();

        res.json({
            message: "Estatus actualizado correctamente"
        });

    } catch (error) {

        if (connection) await connection.rollback();

        res.status(500).json({
            message: "Error al cambiar estatus"
        });

    } finally {

        if (connection) connection.release();

    }
};