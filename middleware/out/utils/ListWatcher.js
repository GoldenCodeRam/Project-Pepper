"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable require-jsdoc */
class ListWatcher {
    constructor(callback, data = null) {
        this._callback = callback;
        if (data) {
            this._data = [data];
        }
        else {
            this._data = [];
        }
    }
    get data() {
        return Array.from(this._data);
    }
    add(data) {
        this._data.push(data);
        this._callback();
    }
    pop() {
        return this._data.pop();
    }
}
exports.default = ListWatcher;
