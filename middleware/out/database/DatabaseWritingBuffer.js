"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DatabaseWritingBuffer {
    constructor() {
        this._writingBuffer = [];
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    addToWritingBuffer(serverName, dateChecked, serverCode) {
        this._writingBuffer.push({
            serverName: serverName,
            dateChecked: dateChecked,
            serverCode: serverCode,
        });
    }
}
exports.default = DatabaseWritingBuffer;
