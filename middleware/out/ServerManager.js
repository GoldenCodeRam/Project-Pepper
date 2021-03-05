"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable require-jsdoc */
const Server_1 = __importStar(require("./Server"));
const util_1 = __importDefault(require("util"));
const child_process_1 = __importDefault(require("child_process"));
const ServerMonitor_1 = __importDefault(require("./ServerMonitor"));
const ServerStatus_1 = require("./ServerStatus");
const MAX_SERVER_INSTANCES = 50;
const BASE_SERVER_PORT = 4000;
class ServerManager {
    constructor() {
        this._serverMonitors = [];
        this.getCurrentRunningServers().then((runningServers) => {
            this.getServersFromLogFiles().then((serversFromLogFiles) => {
                const allServers = this.getAllServers(runningServers, serversFromLogFiles);
                this._serverMonitors = this.createServerMonitors(allServers);
                this._serverMonitors.forEach((serverMonitor) => {
                    serverMonitor.startMonitoringServer();
                });
            });
        });
        console.log('⚠️ 🗄️ Server manager started');
    }
    getServersStatus() {
        const statuses = [];
        this._serverMonitors.forEach((monitor) => {
            statuses.push(monitor.getCurrentServerStatus());
        });
        return statuses;
    }
    restartServer(serverName) {
        this._serverMonitors.forEach((monitor) => {
            if (monitor.serverName === serverName) {
                console.log(`⚠️ 🗄️ Restarting server: ${monitor.serverName}`);
                monitor.restartServer();
            }
        });
    }
    createNewServer() {
        const serverCount = this._serverMonitors.length;
        const availablePort = this.getAvailablePort();
        if (availablePort > 0) {
            console.log(`☑️ 🗄️ Total servers up: ${serverCount}`);
            const server = new Server_1.default(availablePort);
            const result = server.startServer(() => {
                const serverMonitor = new ServerMonitor_1.default(server);
                serverMonitor.startMonitoringServer();
                this._serverMonitors.push(serverMonitor);
            });
            if (result) {
                return result;
            }
        }
    }
    sendImageToServer(callback) {
        const serverIndex = 0;
        console.log('⚠️ Load balancing the image response!');
        const availableServers = [];
        this._serverMonitors.forEach((monitor) => {
            if (monitor.getCurrentServerStatus().code != ServerStatus_1.SERVICE_UNAVAILABLE) {
                availableServers.push(monitor);
            }
        });
        if (availableServers.length == 0) {
            return;
        }
        if (this._activeServer) {
            const serverIndex = (availableServers.indexOf(this._activeServer) + 1) % availableServers.length;
            this._activeServer = availableServers[serverIndex];
            console.log(`⚠️ 🗄️ ${this._activeServer.serverName} getting the request.`);
        }
        else {
            this._activeServer = availableServers[serverIndex];
            console.log(`⚠️ 🗄️ ${this._activeServer.serverName} getting the request.`);
        }
        const nextServerIndex = (availableServers.indexOf(this._activeServer) + 1) % availableServers.length;
        console.log(`⚠️ 🗄️ ${availableServers[nextServerIndex].serverName} will get the next request`);
        this._activeServer.sendImage(callback);
    }
    async clearTemp() {
        console.log('⚠️ 🗑️ Clearing temporary files...');
        const process = util_1.default.promisify(child_process_1.default.exec);
        const { stderr } = await process('bash ./scripts/clearTemp.sh');
        if (stderr) {
            console.log(`Something went wrong clearing the temporary files: ${stderr}`);
        }
    }
    // =========================================== PRIVATE METHODS ===================================
    async getCurrentRunningServers() {
        console.log('⚠️ 🐋 Loading script to check running servers in Docker...');
        const servers = [];
        const process = util_1.default.promisify(child_process_1.default.exec);
        const { stdout, stderr } = await process('bash ./scripts/getRunningServersPorts.sh');
        if (stderr) {
            console.log(`Something went wrong with the checking of the servers: ${stderr}`);
            return [];
        }
        stdout.split('\n').forEach((port) => {
            if (port.length > 0 && !isNaN(parseInt(port))) {
                const server = new Server_1.default(parseInt(port));
                servers.push(server);
            }
        });
        console.log('⚠️ 🐋 Servers running in Docker found:');
        console.log(servers);
        return servers;
    }
    ;
    async getServersFromLogFiles() {
        const servers = [];
        const process = util_1.default.promisify(child_process_1.default.exec);
        const { stdout, stderr } = await process('bash ./scripts/getServersLogFiles.sh');
        if (stderr) {
            console.log(`Something went wrong with getting the servers log files: ${stderr}`);
            return [];
        }
        stdout.split('\n').forEach((logFile) => {
            if (logFile.length > 0) {
                const ports = logFile.split(Server_1.LOG_FILE_BASE_NAME);
                const server = new Server_1.default(parseInt(ports[1]));
                servers.push(server);
            }
        });
        console.log('⚠️ 📋 Servers found from the log files:');
        console.log(servers);
        return servers;
    }
    getAllServers(serversRunning, serversFromLogFiles) {
        console.log('⚠️ 🗄️ Merging running servers and log files...');
        const servers = Array.from(serversRunning);
        let duplicated = false;
        for (let i = 0; i < serversFromLogFiles.length; i++) {
            duplicated = false;
            serversRunning.forEach((server) => {
                if (serversFromLogFiles[i].compareName(server)) {
                    duplicated = true;
                    return;
                }
            });
            if (!duplicated) {
                servers.push(serversFromLogFiles[i]);
            }
        }
        console.log('⚠️ 🗄️ Running servers and log files found:');
        console.log(servers);
        return servers;
    }
    createServerMonitors(servers) {
        const monitors = [];
        servers.forEach((server) => {
            monitors.push(new ServerMonitor_1.default(server));
        });
        return monitors;
    }
    getAvailablePort() {
        console.log(`Searching for available port between ports ${BASE_SERVER_PORT} and ${BASE_SERVER_PORT + MAX_SERVER_INSTANCES}...`);
        const occupiedPorts = [];
        let pendientPort = -1;
        this._serverMonitors.forEach((monitor) => {
            occupiedPorts.push(monitor.serverPort);
        });
        for (let i = 0; i + BASE_SERVER_PORT < BASE_SERVER_PORT + MAX_SERVER_INSTANCES; i++) {
            pendientPort = i + BASE_SERVER_PORT;
            occupiedPorts.forEach((port) => {
                if (port === pendientPort) {
                    pendientPort = -1;
                }
            });
            if (pendientPort != -1) {
                return pendientPort;
            }
        }
        return pendientPort;
    }
}
exports.default = ServerManager;
