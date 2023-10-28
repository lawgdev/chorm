import clc from "cli-color";
import type {
  ErrorLogParams,
  LogParams,
  Logger as LoggerClass,
} from "@clickhouse/client";

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
}
