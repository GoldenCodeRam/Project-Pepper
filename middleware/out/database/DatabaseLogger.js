"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
class DatabaseLogger {
    constructor(serverName) {
        this._serverName = serverName;
        (async () => {
            this._logFile = await sqlite_1.open({
                filename: `database/${serverName}.sqlite`,
                driver: sqlite3_1.default.cached.Database,
            });
            this.initializeDatabase();
        })();
    }
    writeLog(dateChecked, serverResponseCode) {
        if (this._logFile) {
            console.log(`⚠️ Adding log into database, ${this._serverName}: code ${serverResponseCode}...`);
            this._logFile.run(`INSERT INTO ${this._serverName} (date, code) VALUES (?, ?)`, [dateChecked, serverResponseCode]);
        }
    }
    initializeDatabase() {
        this._logFile?.exec(`CREATE TABLE IF NOT EXISTS ${this._serverName} (date NUMBER, code NUMBER)`);
    }
}
exports.default = DatabaseLogger;
