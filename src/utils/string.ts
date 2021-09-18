const CAMEL_REGX = /[^a-zA-Z0-9]+(.)/g;

export const camelCase = (string: string) =>
  string.toLowerCase().replace(CAMEL_REGX, (_, chr) => chr.toUpperCase());
