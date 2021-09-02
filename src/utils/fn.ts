export const renderValueAs = (value: any, renderAs: string) => {
  switch (renderAs) {
    case "json":
      return JSON.stringify(value, null, 2);

    default:
      return (<any>window)?.[renderAs]?.(value);
  }
};
