import express from 'express'
import { Server } from "socket.io";
import { createServer } from "node:http";

const port = process.env.PORT ?? 8080

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("message", (e) => {
    console.log(e);

    io.emit("message", "socking dick");
  });
});



app.get("/",(req, res)=>{
    res.send("Lo mas fresa del pedazo")
})

server.listen(port, ()=>console.log("i'm running"))