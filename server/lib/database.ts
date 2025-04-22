import { connect, Mongoose } from 'mongoose';
import { Logger as WinstonLogger } from "winston";

import { Logger } from "./logger";

export class MongooseClient {
  private static instance: Mongoose;
  private static logger: WinstonLogger = Logger.getInstance();
  private static metadata: Record<string, string> = { section: "MongooseClient" };

  private constructor() { }

  public static async getInstance(): Promise<Mongoose> {
    if (!MongooseClient.instance) {
      this.logger.info('Connecting to MongoDB...', this.metadata);

      try {
        if (!process.env.MONGO_URI) {
          throw new Error('MONGO_URI environment variable is not set');
        }

        MongooseClient.instance = await connect(process.env.MONGO_URI);
      }
      catch (error) {
        this.logger.error('Error connecting to MongoDB:' + JSON.stringify(error), this.metadata);
      }
    }

    this.logger.info('MongoDB connection established', this.metadata);

    return MongooseClient.instance;
  }
}