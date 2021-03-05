/* eslint-disable require-jsdoc */
import Server, {LOG_FILE_BASE_NAME} from './Server';
import util from 'util';
import ChildProcess from 'child_process';
import ServerMonitor from './ServerMonitor';
import {ServerStatus, SERVICE_UNAVAILABLE} from './ServerStatus';

const MAX_SERVER_INSTANCES = 50;
const BASE_SERVER_PORT = 4000;

export default class ServerManager {
  private _serverMonitors: ServerMonitor[] = [];
  private _activeServer: ServerMonitor | undefined;

  constructor() {
    this.getCurrentRunningServers().then((runningServers: Server[]) => {
      this.getServersFromLogFiles().then((serversFromLogFiles: Server[]) => {
        const allServers = this.getAllServers(runningServers, serversFromLogFiles);
        this._serverMonitors = this.createServerMonitors(allServers);
        
        this._serverMonitors.forEach((serverMonitor) => {
          serverMonitor.startMonitoringServer();
        });
      });
    });
    console.log('⚠️ 🗄️ Server manager started');
  }

  public getServersStatus(): ServerStatus[] {
    const statuses: ServerStatus[] = [];
    this._serverMonitors.forEach((monitor) => {
      statuses.push(monitor.getCurrentServerStatus());
    });
    return statuses;
  }

  public restartServer(serverName: String) {
    this._serverMonitors.forEach((monitor) => {
      if (monitor.serverName === serverName) {
        console.log(`⚠️ 🗄️ Restarting server: ${monitor.serverName}`);
        monitor.restartServer();
      }
    });
  }

  public createNewServer(): Error | void {
    const serverCount = this._serverMonitors.length;
    const availablePort = this.getAvailablePort();
    if (availablePort > 0) {
      console.log(`☑️ 🗄️ Total servers up: ${serverCount}`);
      const server = new Server(availablePort);
      const result: Error | void = server.startServer(() => {
        const serverMonitor = new ServerMonitor(server);
        serverMonitor.startMonitoringServer();
        this._serverMonitors.push(serverMonitor);
      });
      if (result) {
        return result;
      }
    }
  }

  public sendImageToServer(callback: Function) {
    const serverIndex = 0;

    console.log('⚠️ Load balancing the image response!');

    const availableServers: ServerMonitor[] = [];
    this._serverMonitors.forEach((monitor) => {
      if (monitor.getCurrentServerStatus().code != SERVICE_UNAVAILABLE) {
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
    } else {
      this._activeServer = availableServers[serverIndex];
      console.log(`⚠️ 🗄️ ${this._activeServer.serverName} getting the request.`);
    }
    const nextServerIndex = (availableServers.indexOf(this._activeServer) + 1) % availableServers.length;
    console.log(`⚠️ 🗄️ ${availableServers[nextServerIndex].serverName} will get the next request`);

    this._activeServer.sendImage(callback);
  }

  public async clearTemp() {
    console.log('⚠️ 🗑️ Clearing temporary files...');

    const process = util.promisify(ChildProcess.exec);
    const {stderr} = await process('bash ./scripts/clearTemp.sh');

    if (stderr) {
      console.log(`Something went wrong clearing the temporary files: ${stderr}`);
    }
  }

  // =========================================== PRIVATE METHODS ===================================

  private async getCurrentRunningServers() {
    console.log('⚠️ 🐋 Loading script to check running servers in Docker...');

    const servers: Array<Server> = [];
    const process = util.promisify(ChildProcess.exec);
    const {stdout, stderr} = await process('bash ./scripts/getRunningServersPorts.sh');

    if (stderr) {
      console.log(`Something went wrong with the checking of the servers: ${stderr}`);
      return [];
    }
    stdout.split('\n').forEach((port) => {
      if (port.length > 0 && !isNaN(parseInt(port))) {
        const server = new Server(parseInt(port));
        servers.push(server);
      }
    });
    console.log('⚠️ 🐋 Servers running in Docker found:');
    console.log(servers);
    return servers;
  };

  private async getServersFromLogFiles(): Promise<Server[]> {
    const servers: Array<Server> = [];

    const process = util.promisify(ChildProcess.exec);
    const {stdout, stderr} = await process('bash ./scripts/getServersLogFiles.sh');

    if (stderr) {
      console.log(`Something went wrong with getting the servers log files: ${stderr}`);
      return [];
    }
    stdout.split('\n').forEach((logFile) => {
      if (logFile.length > 0) {
        const ports = logFile.split(LOG_FILE_BASE_NAME);
        const server = new Server(parseInt(ports[1]));
        servers.push(server);
      }
    });
    console.log('⚠️ 📋 Servers found from the log files:');
    console.log(servers);
    return servers;
  }

  private getAllServers(serversRunning: Server[], serversFromLogFiles: Server[]): Server[] {
    console.log('⚠️ 🗄️ Merging running servers and log files...');
    const servers = Array.from(serversRunning);
    let duplicated: Boolean = false;
    
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

  private createServerMonitors(servers: Server[]): ServerMonitor[] {
    const monitors: ServerMonitor[] = [];
    servers.forEach((server) => {
      monitors.push(new ServerMonitor(server));
    });
    return monitors;
  }

  private getAvailablePort(): Number {
    console.log(`Searching for available port between ports ${BASE_SERVER_PORT} and ${BASE_SERVER_PORT + MAX_SERVER_INSTANCES}...`);
    
    const occupiedPorts: Array<Number> = [];
    let pendientPort: Number = -1;
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
