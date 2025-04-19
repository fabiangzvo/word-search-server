import { Server } from "socket.io";
import { createServer } from "node:http";
import { loadEnvFile } from 'node:process'

process.env.NODE_ENV !== "production" && loadEnvFile()

const port = process.env.SERVER_PORT ?? 8000

const server = createServer()
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("ping", (e) => {
    console.log(e);

    io.emit("ping", "socket is working");
  });
});

server.listen(port, () => console.log(`server is running on port: ${port}`))