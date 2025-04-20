import { createServer } from "node:http";
import { loadEnvFile } from "node:process";

import { WebSocketServer } from "./sockets";

process.env.NODE_ENV !== "production" && loadEnvFile();

const port = process.env.PORT ?? 8000;

const server = createServer();

new WebSocketServer(server);

server.listen(port, () => console.log(`server is running on port: ${port}`));
