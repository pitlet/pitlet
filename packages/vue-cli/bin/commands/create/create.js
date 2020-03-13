"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const fs_extra_1 = __importDefault(require("fs-extra"));
const ROOT = path_1.default.join(__dirname, '../../../');
const TEMPLATE = path_1.default.join(ROOT, 'template');
exports.create = ({ name }) => {
    const cwd = process.cwd();
    const workspaceFolder = path_1.default.join(cwd, name);
    if (fs_extra_1.default.existsSync(workspaceFolder)) {
        fs_extra_1.default.removeSync(workspaceFolder);
    }
    fs_extra_1.default.copySync(TEMPLATE, workspaceFolder);
    child_process_1.execSync(`cd ${workspaceFolder} && npm install`, {
        stdio: 'ignore',
    });
    console.log('created');
};
