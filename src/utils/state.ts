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

export const getStates = (states: any, path: string) =>
  !path ? states : baseGet(states, path);

export const getSafeStates = (name: string, states: any, path: string) =>
  baseGet(Object.freeze({ [name]: states }), path);

export const getSafeGlobalStates = (statesName: string, path: string) => {
  const states = Object.freeze({
    [statesName]: (<any>window)[statesName],
  });
  return !path ? states : baseGet(states, path);
};

export const getGlobalStates = (statesName: string, path: string) => {
  const states = (<any>window)[statesName];
  return !path ? states : baseGet(states, path);
};

export const getGlobalStatesDefault = (statesName: string, path: string) => {
  const value = getSafeGlobalStates(statesName, path);
  return ![null, undefined].includes(value) ? value : path;
};

export const createObserver = (
  states: any,
  onChange: (key: string, value: any) => void = () => {}
) => {
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
