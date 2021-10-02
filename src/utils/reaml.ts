import { global } from "@utils/helpers";
import { camelCase } from "./string";

type ReamlObject = {
  fx: {
    [componentName: string]: [componentId: string, fn: Function][];
  };
};

type CreateFnOptions = {
  createFnName: GlobalFunction;
  componentId?: string;
  componentName: string;
  defineFn?: boolean;
};

export enum GlobalFunction {
  createObserver = "createObserver",
  createRef = "createRef",
}

const REAMLGlobalObjectName = "$$REAML";

export const createREAMLObject = () =>
  global<ReamlObject>(REAMLGlobalObjectName, {
    fx: {},
  });

export const getREAMLObject = () => global<ReamlObject>(REAMLGlobalObjectName);

export const createFn = ({
  createFnName,
  componentId,
  componentName = "",
  defineFn = true,
}: CreateFnOptions) => {
  const generatedName = `__${createFnName}\$${camelCase(
    componentName + componentId
  )}`;

  const fnName = !componentName ? createFnName : generatedName;

  if (defineFn) {
    global(fnName, (fn: (...args: any) => void) => {
      if (!componentId) return;

      const reaml = getREAMLObject();
      if (!componentName) return;
      if (!reaml.fx[componentName]) reaml.fx[componentName] = [];
      reaml.fx[componentName].push([componentId, fn]);
    });
  }

  return fnName;
};

export const createObserverFn = (componentId?: string, componentName = "") =>
  createFn({
    createFnName: GlobalFunction.createObserver,
    componentId,
    componentName,
  });

export const createRefFn = (componentId?: string, componentName: string = "") =>
  createFn({
    createFnName: GlobalFunction.createRef,
    componentId,
    componentName,
    defineFn: false,
  });
