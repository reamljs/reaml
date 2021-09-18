import { global } from "@utils/helpers";
import { camelCase } from "./string";

type ReamlObject = {
  fx: {
    [componentName: string]: [componentId: string, fn: Function][];
  };
};

export enum GlobalFunction {
  createObserver = "createObserver",
}

const REAMLGlobalObjectName = "$$REAML";

export const createREAMLObject = () =>
  global<ReamlObject>(REAMLGlobalObjectName, {
    fx: {},
  });

export const getREAMLObject = () => global<ReamlObject>(REAMLGlobalObjectName);

export const createObserverFn = (
  componentId?: string,
  componentName: string = ""
) => {
  const observerName = `__${GlobalFunction.createObserver}\$${camelCase(
    componentName + componentId
  )}`;
  const fnName = !componentName ? GlobalFunction.createObserver : observerName;
  global(fnName, (fn: (states: any, props: any) => void) => {
    if (!componentId) return;
    const reaml = getREAMLObject();
    if (!componentName) return;
    if (!reaml.fx[componentName]) {
      reaml.fx[componentName] = [];
    }

    reaml.fx[componentName].push([componentId, fn]);
  });
  return observerName;
};
