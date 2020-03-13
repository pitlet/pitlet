#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const create_1 = require("./commands/create/create");
console.log('hello world');
commander_1.default
    .option('create <app-name>')
    .description('create a new project powered by vue-cli-service')
    .action(cmd => {
    const name = cmd.create;
    if (!name) {
        throw new Error('must provide name');
    }
    create_1.create({ name });
});
commander_1.default.parse(process.argv);
