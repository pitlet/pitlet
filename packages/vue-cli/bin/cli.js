#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const create_1 = require("./commands/create/create");
const build_1 = require("./commands/build/build");
require("source-map-support/register");
commander_1.default
    .command('create <app-name>')
    .description('create a new project powered by vue-cli-service')
    .action(async (name) => {
    if (!name) {
        throw new Error('must provide name');
    }
    await create_1.create({ name });
});
commander_1.default
    .command('build')
    .description('build the project')
    .action(async () => {
    await build_1.build();
});
commander_1.default.parse(process.argv);
//# sourceMappingURL=cli.js.map