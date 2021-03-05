/* eslint-disable require-jsdoc */
import ChildProcess from 'child_process';

export const LOG_FILE_BASE_NAME = 'server_';

export default class Server {
  private _name: String;
  public get name(): String {
    return this._name;
  }

  private _port: Number;
  public get port(): Number {
    return this._port;
  }

  private _isAvailable: Boolean;
  public get isAvailable(): Boolean {
    return this._isAvailable;
  }

  constructor(port: Number) {
    this._name = `${LOG_FILE_BASE_NAME}${port}`;
    this._port = port;
    this._isAvailable = false;
  }

  public static serverFromServerName(name: String): Server {
    const serverPort = parseInt(name.replace('server_', ''));
    return new Server(serverPort);
  }

  public startServer(callback: Function = () => {}): Error | void {
    console.log(`⚠️ 🗄️ Loading script to create server at port: ${this._port}...`);
    ChildProcess.exec(`bash ./scripts/createServer.sh ${this._port}`, (error, stdout, stderr) => {
      if (stderr || error) {
        console.log(stderr || error);
        return new Error('❌ 🗄️ The server couldn\'t be started!');
      } else {
        callback();
        console.log(`☑️ 🗄️ New server: ${this._name}, at port ${this._port}`);
      }
    });
  }

  public setAvailable() {
    this._isAvailable = true;
  }

  public setUnavailable() {
    this._isAvailable = false;
  }

  public compareName(server: Server): Boolean {
    return !Boolean(this._name.localeCompare(server._name.toString()));
  }
}
