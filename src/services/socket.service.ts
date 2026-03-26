import { Server } from "socket.io";
import { aceptarServicioSocket, actualizarUbicacionSocket } from "../controllers/servicio.controller";

let io: Server;

export const initSocket = (server: any) => {
    io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on("connection", (socket) => {
        console.log("Conductor conectado:", socket.id);

        // Registrar conductor
        socket.on("registrarConductor", (idConductor) => {
            socket.join(`conductor_${idConductor}`);
            console.log(`Conductor ${idConductor} registrado`);
        });

        // Actualizar ubicación en tiempo real
        socket.on("ubicacion", async (data) => {
            const { idConductor, latitud, longitud } = data;

            try {
                await actualizarUbicacionSocket(idConductor, latitud, longitud);
                socket.emit("ubicacionActualizada", { message: "Ubicación actualizada" });
            } catch (error) {
                socket.emit("errorUbicacion", { message: "Error actualizando ubicación", error });
            }
        });

        // Aceptar servicio
        socket.on("aceptarServicio", async (data) => {
            const { idServicio, idConductor  } = data;

            try {
                const result = await aceptarServicioSocket(idServicio, idConductor, socket);
                if (result.ok) {
                    socket.emit("servicioAceptado", result);
                } else {
                    socket.emit("errorServicio", result);
                }
            } catch (error) {
                socket.emit("errorServicio", { ok: false, message: "Error al aceptar servicio", error });
            }
        });

        socket.on("disconnect", () => {
            console.log("Conductor desconectado:", socket.id);
        });
    });

    return io;
};

export const getIO = () => io;