import { Request, Response } from "express";
import pool from "../config/db.config";

export const createDireccion = async (req: Request, res: Response) => {

    const {
        direccionTexto,
        codigoPostal,
        latitud,
        longitud,
        ciudad,
        estado,
        pais
    } = req.body;

    try {

        const [result]: any = await pool.query(
            `INSERT INTO Direccion
            (direccionTexto, codigoPostal, latitud, longitud, ciudad, estado, pais)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                direccionTexto,
                codigoPostal,
                latitud,
                longitud,
                ciudad,
                estado,
                pais
            ]
        );

        res.status(201).json({
            message: "Dirección creada correctamente",
            idDireccion: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error al crear dirección"
        });

    }

};

export const getDireccionById = async (req: Request, res: Response) => {

    const { id } = req.params;

    try {

        const [rows]: any = await pool.query(
            `SELECT * FROM Direccion WHERE idDireccion = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Dirección no encontrada"
            });
        }

        res.json(rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error al obtener dirección"
        });

    }

};

export const createOrigenDestino = async (req: Request, res: Response) => {

    const { origen, destino } = req.body;

    let connection;

    try {

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [origenResult]: any = await connection.query(
            `INSERT INTO Direccion
            (direccionTexto, codigoPostal, latitud, longitud, ciudad, estado, pais)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                origen.direccionTexto,
                origen.codigoPostal,
                origen.latitud,
                origen.longitud,
                origen.ciudad,
                origen.estado,
                origen.pais
            ]
        );

        const [destinoResult]: any = await connection.query(
            `INSERT INTO Direccion
            (direccionTexto, codigoPostal, latitud, longitud, ciudad, estado, pais)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                destino.direccionTexto,
                destino.codigoPostal,
                destino.latitud,
                destino.longitud,
                destino.ciudad,
                destino.estado,
                destino.pais
            ]
        );

        await connection.commit();

        res.status(201).json({
            message: "Direcciones guardadas correctamente",
            idOrigen: origenResult.insertId,
            idDestino: destinoResult.insertId
        });

    } catch (error) {

        if (connection) await connection.rollback();

        console.error(error);

        res.status(500).json({
            message: "Error al guardar direcciones"
        });

    } finally {

        if (connection) connection.release();

    }

};

export const asignarDireccionUsuario = async (req: Request, res: Response) => {

    const {
        idUsuario,
        idDireccion,
        etiqueta,
        referencia,
        esFavorita
    } = req.body;

    try {

        await pool.query(
            `INSERT INTO UsuarioDireccion
            (idUsuario, idDireccion, etiqueta, referencia, esFavorita)
            VALUES (?, ?, ?, ?, ?)`,
            [
                idUsuario,
                idDireccion,
                etiqueta,
                referencia,
                esFavorita
            ]
        );

        res.status(201).json({
            message: "Dirección asociada al usuario"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error al asociar dirección"
        });

    }

};