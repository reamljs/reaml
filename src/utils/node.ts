import { Regx } from "@utils/const";

export const findTextNode = (nodes: NodeListOf<ChildNode>) =>
  Array.from(nodes).filter((el) => el.nodeType === Node.TEXT_NODE);

export const isStateNode = (value?: string | undefined | null) =>
  value && value.match(Regx.vars);

export const createElement = (
  name: string,
  elementClass: CustomElementConstructor
) => {
  customElements.define(name, elementClass);
};
