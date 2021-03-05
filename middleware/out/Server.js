"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOG_FILE_BASE_NAME = void 0;
/* eslint-disable require-jsdoc */
const child_process_1 = __importDefault(require("child_process"));
exports.LOG_FILE_BASE_NAME = 'server_';
class Server {
    constructor(port) {
        this._name = `${exports.LOG_FILE_BASE_NAME}${port}`;
        this._port = port;
        this._isAvailable = false;
    }
    get name() {
        return this._name;
    }
    get port() {
        return this._port;
    }
    get isAvailable() {
        return this._isAvailable;
    }
    static serverFromServerName(name) {
        const serverPort = parseInt(name.replace('server_', ''));
        return new Server(serverPort);
    }
    startServer(callback = () => { }) {
        console.log(`⚠️ 🗄️ Loading script to create server at port: ${this._port}...`);
        child_process_1.default.exec(`bash ./scripts/createServer.sh ${this._port}`, (error, stdout, stderr) => {
            if (stderr || error) {
                console.log(stderr || error);
                return new Error('❌ 🗄️ The server couldn\'t be started!');
            }
            else {
                callback();
                console.log(`☑️ 🗄️ New server: ${this._name}, at port ${this._port}`);
            }
        });
    }
    setAvailable() {
        this._isAvailable = true;
    }
    setUnavailable() {
        this._isAvailable = false;
    }
    compareName(server) {
        return !Boolean(this._name.localeCompare(server._name.toString()));
    }
}
exports.default = Server;
