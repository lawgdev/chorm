#!/usr/bin/env node

import { Command } from "commander";
import * as cliSubcommands from "./subcommands";

function createChormCli() {
  const chormCli = new Command()
    .name("chorm")
    .description("The sane Clickhouse ORM")
    .version("0.0.0");

  for (const command of Object.values(cliSubcommands)) {
    chormCli.addCommand(command);
  }

  chormCli.parse();
}

createChormCli();
