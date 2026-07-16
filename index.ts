import http from "http";
import app from "./src/app";
import { initSocket } from "./src/services/socket.service";

const server = http.createServer(app);

initSocket(server);

server.listen(3000, () => {
    console.log("Servidor corriendo");
});