"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable require-jsdoc */
const Server_1 = __importDefault(require("./Server"));
const util_1 = __importDefault(require("util"));
const child_process_1 = __importDefault(require("child_process"));
const DatabaseManager_1 = __importDefault(require("./database/DatabaseManager"));
const MAX_SERVER_INSTANCES = 50;
const BASE_SERVER_PORT = 4000;
class ServerHandler {
    constructor() {
        this._servers = [];
        this._serverMonitors = [];
        this._activeServer = null;
        this.getCurrentRunningServers().then((servers) => {
            this.getServersFromDatabaseFiles().then((serverDatabases) => {
                this._servers = [...new Set([...servers, ...serverDatabases])];
            });
        });
        console.log('Server handler started');
    }
    //public createNewServer() {
    //  const serverCount = this._servers.length;
    //  const availablePort = this.getAvailablePort();
    //  if (availablePort > 0) {
    //    console.log(`Total servers up: ${serverCount}`);
    //    const server = new Server(availablePort);
    //    server.createServer(() => {
    //      if (this._monitor) {
    //        this._servers.push(server);
    //        this._monitor.startMonitoringServer(server);
    //      }
    //    });
    //  }
    //}
    restartServer(serverName) {
        this._servers.forEach((server) => {
            if (server.serverName === serverName) {
                server.createServer();
            }
        });
    }
    sendImageToServer(image) {
        const serverIndex = 0;
        if (this._activeServer) {
            const serverIndex = (this._servers.indexOf(this._activeServer) + 1) % this._servers.length;
            this._activeServer = this._servers[serverIndex];
        }
        else {
            this._activeServer = this._servers[serverIndex];
        }
        this._activeServer.sendImage();
    }
    // =========================================== PRIVATE METHODS ===================================
    async getCurrentRunningServers() {
        console.log('Loading script to check running servers in docker...');
        const servers = [];
        const process = util_1.default.promisify(child_process_1.default.exec);
        const { stdout, stderr } = await process('bash ./scripts/getServersPorts.sh');
        if (stderr) {
            console.log(`Something went wrong with the checking of the servers: ${stderr}`);
            return [];
        }
        stdout.split('\n').forEach((port) => {
            if (port.length > 0 && !isNaN(parseInt(port))) {
                const server = new Server_1.default(parseInt(port));
                server.setAvailable();
                servers.push(server);
            }
        });
        console.log('Servers found:');
        console.log(servers);
        return servers;
    }
    ;
    async getServersFromDatabaseFiles() {
        const servers = [];
        DatabaseManager_1.default.instance.searchServerDatabaseFileNames().then((databaseFileNames) => {
            databaseFileNames.forEach((fileName) => {
                servers.push(Server_1.default.serverFromServerName(fileName));
            });
        });
        return servers;
    }
    getAvailablePort() {
        console.log(`Searching for available port between ports ${BASE_SERVER_PORT} and ${BASE_SERVER_PORT + MAX_SERVER_INSTANCES}...`);
        const occupiedPorts = [];
        let pendientPort = -1;
        this._servers.forEach((server) => {
            occupiedPorts.push(server.serverPort);
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
exports.default = ServerHandler;
