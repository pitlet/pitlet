"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const ROOT = path_1.default.join(__dirname, '../../../');
const TEMPLATE = path_1.default.join(ROOT, 'template');
exports.create = async ({ name }) => {
    console.log('creating project...');
    const cwd = process.cwd();
    const workspaceFolder = path_1.default.join(cwd, name);
    if (fs_extra_1.default.existsSync(workspaceFolder)) {
        fs_extra_1.default.removeSync(workspaceFolder);
    }
    fs_extra_1.default.copySync(TEMPLATE, workspaceFolder);
    console.log('installing dependencies...');
    child_process_1.execSync(`cd ${workspaceFolder} && npm i`, {
        stdio: 'ignore',
    });
    console.log('done!');
    try {
        child_process_1.execSync(`code ${workspaceFolder}`);
    }
    catch (error) { }
};
//# sourceMappingURL=create.js.map