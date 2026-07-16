import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/db.config";
import usuarioRoutes from "./routes/usuario.route";
import loginRoutes from "./routes/login.routes";
import personaRoutes from "./routes/persona.routes";
import conductorRoutes from "./routes/conductores.routes";
import vehiculoRoutes from "./routes/vehiculos.routes";
import adminRoutes from "./routes/admin.routes";
import propietarioRoutes from "./routes/propietario.routes";
import domicilioRoutes from "./routes/domicilio.routes";
import servicioRoutes from "./routes/servicio.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || '';

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuarioRoutes,conductorRoutes, personaRoutes, propietarioRoutes,vehiculoRoutes);
app.use('/api/auth', loginRoutes);
app.use('/api/servicio', domicilioRoutes, servicioRoutes);
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

export default app;