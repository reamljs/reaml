import { global } from "@utils/helpers";

type ReamlObject = {
  fnIterator: string;
  fx: {
    [key: string]: Function;
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

export const addREAMLFn = (fnName: string) => {
  const reaml = getREAMLObject();
  reaml.fnIterator = fnName;
};
