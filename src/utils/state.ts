import { Regx } from "@utils/const";

const baseGet = (obj: any, path: string, defaultValue = undefined) => {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res, key) => (res !== null && res !== undefined ? res[key] : res),
        obj
      );
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
};

export const getStates = (states: any, path: string) => baseGet(states, path);

export const getSafeStates = (states: any, path: string) =>
  baseGet(Object.freeze({ states }), path);

export const getSafeGlobalStates = (path: string) => {
  const states = Object.freeze({ states: (<any>window).states });
  return !path ? states : baseGet(states, path);
};

export const getGlobalStates = (path: string) => {
  const states = (<any>window).states;
  return !path ? states : baseGet(states, path);
};

export const getGlobalStatesDefault = (path: string) => {
  const value = getSafeGlobalStates(path);
  return value !== null ? value : path;
};

export const createStates = (
  states: any,
  onChange: (key: string, value: any) => void = () => {}
) => {
  const createObserver = (states: any) => {
    const validator = {
      get: (target: any, key: string) => {
        let value = target[key];
        if (typeof value === "object" && !Array.isArray(value)) {
          value = createObserver(value);
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

  return createObserver(states);
};

export const updateVars = (
  value: string | null | never,
  vars: any,
  regx: RegExp = Regx.state
) =>
  (value || "").replace(regx, (_, key) => (!key ? vars : getStates(vars, key)));
