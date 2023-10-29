import clc from "cli-color";
import type { ErrorLogParams, LogParams, Logger as LoggerClass } from "@clickhouse/client";

export class Logger implements LoggerClass {
  info(params: LogParams) {
    console.log(`[${clc.cyan(params.module)}] ${params.message}`);
  }

  trace(params: LogParams) {
    console.log(`[${clc.red(params.module)}] ${params.message}`);
  }

  debug(params: LogParams) {
    console.log(`[${clc.green(params.module)}] ${params.message}`);
  }

  warn(params: LogParams) {
    console.log(`[${clc.green(params.module)}] ${params.message}`);
  }

  error(params: ErrorLogParams) {
    console.error(`[${clc.red(params.module)}] ${params.message}`, params.err);
  }

  public static info(prefix: string, message: string | unknown) {
    console.log(`[${clc.cyan(prefix)}] ${message}`);
  }

  public static error(prefix: string, message: string | unknown) {
    console.log(`[${clc.red(prefix)}] ${message}`);
  }

  public static success(prefix: string, message: string | unknown) {
    console.log(`[${clc.green(prefix)}] ${message}`);
  }
}
