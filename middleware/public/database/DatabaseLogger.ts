import Sqlite3 from 'sqlite3';
import {open, Database} from 'sqlite';

/* eslint-disable require-jsdoc */
export interface DatabaseLog {
  serverName: String;
  dateChecked: Number;
  serverCode: Number;
}

export default class DatabaseLogger {
  private _serverName: String;
  private _logFile: Database | undefined;

  constructor(serverName: String) {
    this._serverName = serverName;

    (async () => {
      this._logFile = await open({
        filename: `database/${serverName}.sqlite`,
        driver: Sqlite3.cached.Database,
      });
      this.initializeDatabase();
    })();
  }

  public writeLog(dateChecked: Number, serverResponseCode: Number) {
    if (this._logFile) {
      console.log(`⚠️ Adding log into database, ${this._serverName}: code ${serverResponseCode}...`);
      this._logFile.run(
        `INSERT INTO ${this._serverName} (date, code) VALUES (?, ?)`,
        [dateChecked, serverResponseCode],
      );
    }
  }

  private initializeDatabase() {
    this._logFile?.exec(`CREATE TABLE IF NOT EXISTS ${this._serverName} (date NUMBER, code NUMBER)`);
  }
}
