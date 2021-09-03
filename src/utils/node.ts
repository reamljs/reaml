import { createArray } from "@utils/data";

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

export const querySelectorAll = (
  element: Element | ShadowRoot,
  selector: string
) => element.querySelectorAll(selector);

export const createTag = (tagName: string) => document.createElement(tagName);

export const copyAttrs = (fromElement: Element, toElement: Element) => {
  createArray<Attr>(getAttrList(fromElement)).forEach((attr) => {
    const nodeName = getNodeName(attr);
    const nodeValue = getNodeValue(attr);
    toElement.setAttribute(getNodeName(attr), nodeValue ? nodeValue : nodeName);
  });
};
