import get from "lodash/get";
import { Regx } from "@utils/const";

export const getStates = (states: any, path: string) => get(states, path);

export const getSafeStates = (states: any, path: string) =>
  get(Object.freeze({ states }), path);

export const initState = (
  states: any,
  onChange: (key: string, value: any) => void = () => {}
) => {
  const observer = (states: any) => {
    const validator = {
      get: (target: any, key: string) => {
        let value = target[key];
        if (typeof value === "object" && !Array.isArray(value)) {
          value = observer(value);
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

  (<any>window).states = observer(states);
};

export const updateNodeValueState = (
  value: string | null | never,
  states: any
) => (value || "").replace(Regx.state, (_, key) => getStates(states, key));
