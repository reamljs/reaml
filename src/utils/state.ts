import { global } from "@utils//helpers";
import { EventTypes } from "@utils/const";

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
  onChange: (key: string, prevValue: any, nextValue: any) => void = () => {}
  // host?: Element | ShadowRoot
): T => {
  const validator: ProxyHandler<object> = {
    get(target: any, key: string) {
      let value = target[key];
      if (typeof value === "object" && !Array.isArray(value)) {
        value = createObserver(value, onChange);
      }

      return value;
    },

    set(target: any, key: string, value) {
      const prevValue = Object.freeze(Object.assign({}, target));
      states[key] = value;
      const nextValue = states;
      onChange(key, prevValue, nextValue);
      return true;
    },
  };

  return new Proxy(states, validator);
};

export const listenStates = (
  element: Element | Document = document,
  statesName: string,
  fn: EventListenerOrEventListenerObject
) => element.addEventListener(`${EventTypes.StatesUpdate}-${statesName}`, fn);
