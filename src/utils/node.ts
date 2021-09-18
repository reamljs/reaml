import { createArray } from "@utils/data";

export const createElement = (
  name: string,
  elementClass: CustomElementConstructor,
  options: ElementDefinitionOptions = {}
) => {
  customElements.define(name, elementClass, options);
};

export const getNodeName = (node: Node | Attr) => node.nodeName;

export const getNodeValue = (node: Node | Attr) => node.nodeValue;

export const getAttrList = (element: Element) => element.attributes;

export const getAttr = (element: Element, attrName: string): string =>
  element.getAttribute(attrName) || "";

export const getHTML = (element: Element) => element.innerHTML;

export const getContent = (element: Element) =>
  element.textContent?.trim() ?? "";

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

export const setAttr = (
  element: Element,
  attrName: string,
  attrValue: string
) => {
  element.setAttribute(attrName, attrValue);
};

export const copyAttrs = (
  fromElementOrAttrs: Element | NamedNodeMap,
  toElement: Element
) => {
  const attrs =
    fromElementOrAttrs instanceof NamedNodeMap
      ? fromElementOrAttrs
      : getAttrList(fromElementOrAttrs);
  createArray<Attr>(attrs).forEach((attr) => {
    const nodeName = getNodeName(attr);
    const nodeValue = getNodeValue(attr);
    setAttr(toElement, getNodeName(attr), nodeValue ? nodeValue : nodeName);
  });
};
