import { createServer } from "node:http";
import { loadEnvFile } from "node:process";

import { Logger } from "@lib/logger";
import { WebSocketServer } from "./sockets";

process.env.NODE_ENV !== "production" && loadEnvFile();

const port = process.env.PORT ?? 8000;

const server = createServer();

new WebSocketServer(server);

server.listen(port, () => {
    const logger = Logger.getInstance();

    logger.info(`new server is running on port: ${port}`, { section: "server" })
});
