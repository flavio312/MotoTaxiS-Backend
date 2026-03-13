import { Request, Response } from "express";
import pool from "../config/db.config";

export const createDireccion = async (req: Request, res: Response) => {

    const {
        idAsentamiento,
        numeroExt,
        numeroInt,
        codigoPostal,
        latitud,
        longitud
    } = req.body;

    try {

        const [result]: any = await pool.query(
            `INSERT INTO Direccion
            (idAsentamiento, numeroExt, numeroInt, codigoPostal, latitud, longitud)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                idAsentamiento,
                numeroExt,
                numeroInt,
                codigoPostal,
                latitud,
                longitud
            ]
        );

        res.status(201).json({
            message: "Dirección creada correctamente",
            idDireccion: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error al crear la dirección"
        });

    }
};

export const getDireccionById = async (req: Request, res: Response) => {

    const { id } = req.params;

    try {

        const [rows]: any = await pool.query(
            `SELECT 
                d.idDireccion,
                a.nombre AS asentamiento,
                m.nombre AS municipio,
                e.nombre AS entidad,
                z.zona,
                ta.tipoAsentamiento,
                d.numeroExt,
                d.numeroInt,
                d.codigoPostal,
                d.latitud,
                d.longitud
            FROM Direccion d
            INNER JOIN Asentamientos a 
                ON d.idAsentamiento = a.idAsentamiento
            INNER JOIN Municipio m 
                ON a.idMunicipio = m.idMunicipio
            INNER JOIN Entidad e 
                ON m.idEntidad = e.idEntidad
            INNER JOIN Zona z 
                ON a.idZona = z.idZona
            INNER JOIN TipoAsentamiento ta
                ON a.idTipoAsentamiento = ta.idTipoAsentamiento
            WHERE d.idDireccion = ?`,
            [id]
        );

        res.json(rows[0]);

    } catch (error) {

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
            (idAsentamiento, numeroExt, codigoPostal)
            VALUES (?, ?, ?)`,
            [
                origen.idAsentamiento,
                origen.numeroExt,
                origen.codigoPostal
            ]
        );

        const [destinoResult]: any = await connection.query(
            `INSERT INTO Direccion
            (idAsentamiento, numeroExt, codigoPostal)
            VALUES (?, ?, ?)`,
            [
                destino.idAsentamiento,
                destino.numeroExt,
                destino.codigoPostal
            ]
        );

        await connection.commit();

        res.json({
            idOrigen: origenResult.insertId,
            idDestino: destinoResult.insertId
        });

    } catch (error) {

        if (connection) await connection.rollback();

        res.status(500).json({
            message: "Error al crear direcciones"
        });

    } finally {

        if (connection) connection.release();

    }
};