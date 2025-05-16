import {
  createLogger,
  format,
  transports,
  Logger as WinstonLogger,
} from "winston";

const { combine, timestamp, printf, colorize, metadata } = format;

interface Metadata {
  section?: string;
}

export class Logger {
  private static instance: WinstonLogger;
  private static formatLog = printf(
    ({ level, message, timestamp, metadata }) => {
      const { section = "server" } = metadata as Metadata;

      return `[${level}] [${timestamp}] [${section}] ${message}`;
    }
  );

  private constructor() {}

  public static getInstance(): WinstonLogger {
    if (!Logger.instance) {
      Logger.instance = createLogger({
        level: "info",
        format: combine(
          timestamp({ format: "YYYY-MM-DD HH:MM:SS" }),
          colorize(),
          metadata({ fillWith: ["section"] }),
          this.formatLog
        ),
        transports: [new transports.Console()],
      });
    }

    return Logger.instance;
  }
}
