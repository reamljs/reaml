export const renderValueAs = (value: any, renderAs: string) => {
  switch (renderAs) {
    case "json":
      return JSON.stringify(value, null, 2);

    default:
      return (<any>window)?.[renderAs]?.(value);
  }
};

export const callCode = (thisArgs: any, codes: string[], execute?: boolean) => {
  const fn = Function.apply(thisArgs, codes);
  if (!execute) return fn;
  return fn();
};

export const global = <T>(
  key: any,
  value?: any
): Window & typeof globalThis & T => {
  if (value) {
    window[key] = value;
  }

  return <Window & typeof globalThis & T>window[key];
};
