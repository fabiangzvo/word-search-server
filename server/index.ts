import { createServer } from "node:http";
import { loadEnvFile } from "node:process";

import { Logger } from "@lib/logger";
import { MongooseClient } from "@lib/database";

import { WebSocketServer } from "./sockets";


process.env.NODE_ENV !== "production" && loadEnvFile();
const port = process.env.PORT ?? 8000;

(async function () {
    const server = createServer();

    await MongooseClient.getInstance()

    new WebSocketServer(server);

    server.listen(port, () => {
        const logger = Logger.getInstance();

        logger.info(`new server is running on port: ${port}`, { section: "server" })
    });
})()

