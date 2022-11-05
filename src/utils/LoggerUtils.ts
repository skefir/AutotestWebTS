import { ILogObject, Logger } from "tslog";
import { appendFileSync } from "fs";

export function logToTransport(logObject: ILogObject) {
    appendFileSync("logs.txt", JSON.stringify(logObject) + "\n");
  }