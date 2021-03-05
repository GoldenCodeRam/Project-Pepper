/* eslint-disable require-jsdoc */
import Sqlite3 from 'sqlite3';
import DatabaseLog from './DatabaseLogger';
import ListWatcher from '../utils/ListWatcher';

import Util from 'util';
import ChildProcess from 'child_process';

//export default class DatabaseManager {
//  private static _instance: DatabaseManager;
//  public static get instance() {
//    return this._instance || (this._instance = new this());
//  }
//
//  private _serverDatabaseFileNames: Array<String> = [];
//  private _writingBuffer: ListWatcher<DatabaseLog>;
//
//  private constructor() {
//    this._writingBuffer = new ListWatcher<DatabaseLog>(this.writeDataToServerFile);
//    this.searchServerDatabaseFileNames().then((fileNames) => {
//      this._serverDatabaseFileNames = fileNames;
//    });
//  }
//
//  public async writeLogToDatabase(serverName: String, date: Number, serverCode: Number) {
//    if (this._serverDatabaseFileNames.indexOf(serverName) < 0) {
//      
//    }
//    this._writingBuffer.add({
//      serverName: serverName,
//      dateChecked: date,
//      serverCode: serverCode,
//    });
//  }
//
//  // ===================================== PRIVATE METHODS =========================================
//
//  private async searchServerDatabaseFileNames(): Promise<String[]> {
//    console.log('Reading server databases log files...');
//
//    const process = Util.promisify(ChildProcess.exec);
//    const {stdout, stderr} = await process('bash ./scripts/getDatabaseFiles.sh');
//    if (stderr) {
//      console.log(`Something went wrong when reading the database log files: ${stderr}`);
//      return [];
//    }
//    const serverDatabases = stdout.split('\n');
//    console.log('Database files found:');
//    console.log(serverDatabases);
//    return serverDatabases;
//  }
//
//  private writeDataToServerFile() {
//    const databaseLog = this._writingBuffer.pop();
//    if (databaseLog) {
//      this.addLogToDatabase(databaseLog);
//    }
//  }
//
//  private async connectToDatabase(fileName: String) {
//    new Sqlite3.cached.Database(`database/${fileName}.sqlite`);
//    return new Sqlite3.Database(`database/${fileName}.sqlite`);
//  }
//
//  private async checkTableInDatabase(serverName: String, callback: Function) {
//    const database = await this.connectToDatabase(serverName);
//
//    database.all(`SELECT name FROM sqlite_master WHERE type="table" AND name="${serverName}"`, (error, table) => {
//      if (error) {
//        database.close();
//        console.log(error);
//      }
//      if (table) {
//        if (table.length == 0) {
//          console.log(`Creating table for ${serverName}...`);
//          database.run(`CREATE TABLE ${serverName} (date INTEGER, code INTEGER)`);
//        }
//        database.close(() => {
//          callback();
//        });
//      }
//    });
//  }
//
//  private async addLogToDatabase(databaseLog: DatabaseLog) {
//    const database = await this.connectToDatabase(databaseLog.serverName);
//
//    console.log(`Adding log into database, table ${databaseLog.serverName}: code ${databaseLog.serverCode}...`);
//    database.run(`INSERT INTO ${databaseLog.serverName} (date, code) VALUES (?, ?)`, [databaseLog.dateChecked, databaseLog.serverCode], (error) => {
//      if (error) {
//        console.log(error);
//      }
//      database.close();
//    });
//  }
//}
