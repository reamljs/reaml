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

export const getNodeName = (node: Node | Attr) => node.nodeName;

export const getNodeValue = (node: Node | Attr) => node.nodeValue;

export const getAttrList = (element: Element) => element.attributes;

export const getAttr = (element: Element, attrName: string): string =>
  element.getAttribute(attrName) || "";

export const getHTML = (element: Element) => element.innerHTML;

export const setHTML = (
  element: Element | ShadowRoot,
  content: string = ""
) => {
  element.innerHTML = content;
};

export const cleanHTML = (element: Element | ShadowRoot) => setHTML(element);
