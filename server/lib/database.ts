import { connect, Mongoose } from "mongoose";
import { Logger as WinstonLogger } from "winston";
import path from "node:path";
import { glob } from "glob";

import { Logger } from "./logger";

export class MongooseClient {
  private static instance: Mongoose;
  private static logger: WinstonLogger = Logger.getInstance();
  private static metadata: Record<string, string> = {
    section: "MongooseClient",
  };

  private constructor() {}

  public static async getInstance(): Promise<Mongoose> {
    if (!MongooseClient.instance) {
      this.logger.info("Connecting to MongoDB...", this.metadata);

      try {
        if (!process.env.MONGO_URI) {
          throw new Error("MONGO_URI environment variable is not set");
        }

        MongooseClient.instance = await connect(process.env.MONGO_URI);

        await this.loadModels();
      } catch (error) {
        this.logger.error(
          "Error connecting to MongoDB:" + JSON.stringify(error),
          this.metadata
        );
      }
    }

    this.logger.info("MongoDB connection established", this.metadata);

    return MongooseClient.instance;
  }

  private static async loadModels(): Promise<void> {
    const modelsPath = path.resolve(__dirname, "../sockets/events");

    const files = await glob(`${modelsPath}/**/model.{ts,js}`);

    await Promise.all(files.map(async (file) => await import(file)));
  }
}
