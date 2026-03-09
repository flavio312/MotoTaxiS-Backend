import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./src/config/db.config";
import usuarioRoutes from "./src/routes/usuario.route";
import loginRoutes from "./src/routes/login.routes";
import personaRoutes from "./src/routes/persona.routes";
import conductorRoutes from "./src/routes/conductores.routes";
import vehiculoRoutes from "./src/routes/vehiculos.routes";
import adminRoutes from "./src/routes/admin.routes";
import propietarioRoutes from "./src/routes/propietario.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || '';

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuarioRoutes,conductorRoutes, personaRoutes, propietarioRoutes);
app.use('/api/auth', loginRoutes);
app.use('/api/servicio', vehiculoRoutes);
app.use('/api/admin', adminRoutes);

(async () => {
    try {
        await pool.getConnection();
        console.log('Autenticación a la base de datos exitosa');

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }
})();