export const parseValue = (value: any) => {
  const isNumber = !isNaN(parseInt(value) || parseFloat(value));
  const isBoolean = ["true", "false"].includes(value);
  const isNull = value === "null";
  const isUndefined = value === "undefined";
  const isString = !(isNumber || isBoolean || isNull || isUndefined);
  return isString ? value : JSON.parse(`${value}`);
};

export const toPrimitiveObject = (anything: any) =>
  JSON.parse(JSON.stringify(anything));

export const randomNumber = () => {
  const [, , ...num] = Math.random().toString().split("");
  return parseInt(num.join(""));
};

export const randomId = () => randomNumber().toString(0x24);

export const createArray = <T>(any: any): T[] => Array.from(any);
