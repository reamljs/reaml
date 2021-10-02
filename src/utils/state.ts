import { global } from "@utils//helpers";
import { EventTypes } from "./const";

const baseGet = (obj: any, path: string, defaultValue = undefined) => {
  const travel = (regexp: RegExp) =>
    path
      .split(regexp)
      .filter(Boolean)
      .reduce(
        (res, key) => (res !== null && res !== undefined ? res[key] : res),
        obj
      );
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
};

export const getStates = (
  states: any,
  path: string,
  defaultValue = undefined
) => (!path ? states : baseGet(states, path, defaultValue));

export const getSafeStates = (
  name: string,
  states: any,
  path: string,
  defaultValue = undefined
) => baseGet(Object.freeze({ [name]: states }), path, defaultValue);

export const getSafeGlobalStates = (statesName: string, path: string) => {
  const states = Object.freeze({
    [statesName]: global(statesName),
  });
  return !path ? states : baseGet(states, path);
};

export const getGlobalStates = (statesName: string, path: string) => {
  const states = global(statesName);
  return !path ? states : baseGet(states, path);
};

export const getGlobalStatesDefault = (statesName: string, path: string) => {
  const value = getSafeGlobalStates(statesName, path);
  return ![null, undefined].includes(value) ? value : path;
};

export const createObserver = <T>(
  states: any,
  onChange: (key: string, value: any) => void = () => {}
): T => {
  const validator = {
    get: (target: any, key: string) => {
      let value = target[key];
      if (typeof value === "object" && !Array.isArray(value)) {
        value = createObserver(value, onChange);
      }
      return value;
    },

    set: (_: any, key: string, value: any) => {
      states[key] = value;
      onChange(key, value);
      return true;
    },
  };

  return new Proxy(states, validator);
};

export const listenStates = (
  statesName: string,
  fn: EventListenerOrEventListenerObject
) => document.addEventListener(`${EventTypes.StatesUpdate}-${statesName}`, fn);
