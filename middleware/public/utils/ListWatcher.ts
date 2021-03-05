/* eslint-disable require-jsdoc */
export default class ListWatcher<T> {
  private _data: Array<T>;
  public get data() {
    return Array.from(this._data);
  }

  private _callback: Function;

  constructor(callback: Function, data: T | null = null) {
    this._callback = callback;
    if (data) {
      this._data = [data];
    } else {
      this._data = [];
    }
  }

  public add(data: T) {
    this._data.push(data);
    this._callback();
  }

  public pop(): T | undefined {
    return this._data.pop();
  }
}
