import { Request, Response } from "express";
import pool from "../config/db.config";

export const crearDireccion = async (req: Request, res: Response) => {
    const {
        codigoPostal,
        estado,          
        municipio,       
        asentamiento, 
        numeroExterior,
        numeroInterior,
        latitud,
        longitud,
    } = req.body;

    try {
        // 1. Buscar la entidad (estado)
        const [entidadRows]: any = await pool.query(
            "SELECT idEntidad FROM Entidad WHERE nombre = ?",
            [estado]
        );
        if (entidadRows.length === 0) {
            return res.status(400).json({ message: "Entidad no encontrada" });
        }
        const idEntidad = entidadRows[0].idEntidad;

        // 2. Buscar el municipio
        const [municipioRows]: any = await pool.query(
            "SELECT idMunicipio FROM Municipio WHERE nombre = ? AND idEntidad = ?",
            [municipio, idEntidad]
        );
        if (municipioRows.length === 0) {
            return res.status(400).json({ message: "Municipio no encontrado" });
        }
        const idMunicipio = municipioRows[0].idMunicipio;

        // 3. Buscar el asentamiento
        const [asentamientoRows]: any = await pool.query(
            "SELECT idAsentamiento FROM Asentamientos WHERE nombre = ? AND idMunicipio = ?",
            [asentamiento, idMunicipio]
        );
        if (asentamientoRows.length === 0) {
            return res.status(400).json({ message: "Asentamiento no encontrado" });
        }
        const idAsentamiento = asentamientoRows[0].idAsentamiento;

        // 4. Insertar la dirección
        const [result]: any = await pool.query(
            `INSERT INTO Direccion 
            (idAsentamiento, numeroExt, numeroInt, codigoPostal, latitud, longitud) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [idAsentamiento, numeroExterior, numeroInterior, codigoPostal, latitud, longitud]
        );

        res.status(201).json({
            message: "Dirección creada exitosamente",
            idDireccion: result.insertId,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear dirección" });
    }
};


export const createDireccionGoogle = async (req: Request, res: Response) => {

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
            `INSERT INTO DireccionGoogle
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