/// <reference path="./typings/react-addons-update.d.ts" />
const _update = require('react-addons-update');

export function update<T>(obj: T, mod: {}): T {
  const newObj = _update(obj, mod);
  return newObj as T;
}
