import { Regx } from "@utils/const";
import { createArray } from "@utils/data";

export const findTextNode = (nodes: NodeListOf<ChildNode>) =>
  createArray<ChildNode>(nodes).filter((el) => el.nodeType === Node.TEXT_NODE);

export const isStateNode = (value?: string | undefined | null) =>
  value && value.match(Regx.vars);

export const createElement = (
  name: string,
  elementClass: CustomElementConstructor
) => {
  customElements.define(name, elementClass);
};

export const getAttributes = (element: Element) => element.attributes;
