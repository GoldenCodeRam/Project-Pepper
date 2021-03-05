/* eslint-disable require-jsdoc */
import ChildProcess from 'child_process';
import DatabaseLogger from './database/DatabaseLogger';

import Server from './Server';
import {ServerStatus, OK, SERVICE_UNAVAILABLE} from './ServerStatus';
import {sendMail} from './EmailGenerator';

export default class ServerMonitor {
  static TIMEOUT_TIME: Number = 5000;

  private _server: Server;
  private _logger: DatabaseLogger;

  public get serverName() {
    return this._server.name;
  }

  public get serverPort() {
    return this._server.port;
  }

  constructor(server: Server) {
    this._server = server;
    this._logger = new DatabaseLogger(this._server.name);
  }

  public startMonitoringServer() {
    console.log(`☑️ 🗄️ Monitor for server: ${this._server.name} started!`);
    this.getServerStatus();
  }

  public restartServer() {
    this._server.startServer();
  }

  public sendImage(callback: Function) {
    ChildProcess.exec(`bash ./scripts/sendImage.sh ${this.serverPort}`, (error, stdout, stderr) => {
      if (stderr || error) {
        console.log(`exec error: ${error}`);
      } else {
        console.log(stdout);
        callback();
      }
    });
  }

  public getCurrentServerStatus(): ServerStatus {
    return {
      name: this._server.name,
      date: Date.now(),
      code: this._server.isAvailable ? OK : SERVICE_UNAVAILABLE,
    };
  }

  // ========================================== PRIVATE METHODS ====================================

  private getServerStatus() {
    ChildProcess.exec(`bash ./scripts/getServerStatus.sh ${this._server.port}`, (error, stdout, stderr) => {
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

  private sendEmailToAdminIfServerDown(responseCode: Number) {
    if (this._server.isAvailable && responseCode != OK) {
      console.log('⚠️ Sending message to admin because of server down...');
      sendMail(this._server.name.toString(), Date.now());
    }
  }

  private setServerAvailability(responseCode: Number) {
    responseCode == OK ? this._server.setAvailable() : this._server.setUnavailable();
  }

  private async writeToDatabase(responseCode: Number) {
    this._logger.writeLog(Date.now(), responseCode);
  }
}
