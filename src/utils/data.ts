export const parseValue = (value: any) => {
  const isNumber = parseInt(value) || parseFloat(value);
  const isBoolean = ["true", "false"].includes(value);
  const isNull = value === "null";
  const isUndefined = value === "undefined";
  const isNonString = isNumber || isBoolean || isNull || isUndefined;
  return JSON.parse(isNonString ? value : `${value}`);
};

export const toPrimitiveObject = (anything: any) =>
  JSON.parse(JSON.stringify(anything));

export const randomId = () => {
  const [, , ...num] = Math.random().toString().split("");
  return parseInt(num.join("")).toString(32);
};

export const createArray = <T>(any: any): T[] => Array.from(any);
