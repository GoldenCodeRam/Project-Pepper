"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable require-jsdoc */
const child_process_1 = __importDefault(require("child_process"));
const DatabaseLogger_1 = __importDefault(require("./database/DatabaseLogger"));
const ServerStatus_1 = require("./ServerStatus");
const EmailGenerator_1 = require("./EmailGenerator");
class ServerMonitor {
    constructor(server) {
        this._server = server;
        this._logger = new DatabaseLogger_1.default(this._server.name);
    }
    get serverName() {
        return this._server.name;
    }
    get serverPort() {
        return this._server.port;
    }
    startMonitoringServer() {
        console.log(`☑️ 🗄️ Monitor for server: ${this._server.name} started!`);
        this.getServerStatus();
    }
    restartServer() {
        this._server.startServer();
    }
    sendImage(callback) {
        child_process_1.default.exec(`bash ./scripts/sendImage.sh ${this.serverPort}`, (error, stdout, stderr) => {
            if (stderr || error) {
                console.log(`exec error: ${error}`);
            }
            else {
                console.log(stdout);
                callback();
            }
        });
    }
    getCurrentServerStatus() {
        return {
            name: this._server.name,
            date: Date.now(),
            code: this._server.isAvailable ? ServerStatus_1.OK : ServerStatus_1.SERVICE_UNAVAILABLE,
        };
    }
    // ========================================== PRIVATE METHODS ====================================
    getServerStatus() {
        child_process_1.default.exec(`bash ./scripts/getServerStatus.sh ${this._server.port}`, (error, stdout, stderr) => {
            if (stdout) {
                const responseCode = parseInt(stdout);
                this.sendEmailToAdminIfServerDown(responseCode);
                this.setServerAvailability(responseCode);
                this.writeToDatabase(responseCode);
            }
            if (error || stderr) {
                console.log(`❌ ${error}`);
            }
            setTimeout(() => this.getServerStatus(), ServerMonitor.TIMEOUT_TIME.valueOf());
        });
    }
    sendEmailToAdminIfServerDown(responseCode) {
        if (this._server.isAvailable && responseCode != ServerStatus_1.OK) {
            console.log('⚠️ Sending message to admin because of server down...');
            EmailGenerator_1.sendMail(this._server.name.toString(), Date.now());
        }
    }
    setServerAvailability(responseCode) {
        responseCode == ServerStatus_1.OK ? this._server.setAvailable() : this._server.setUnavailable();
    }
    async writeToDatabase(responseCode) {
        this._logger.writeLog(Date.now(), responseCode);
    }
}
exports.default = ServerMonitor;
ServerMonitor.TIMEOUT_TIME = 5000;
