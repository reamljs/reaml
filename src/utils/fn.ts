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
