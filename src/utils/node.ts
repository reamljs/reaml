import { createArray } from "@utils/data";

export const createElement = (
  name: string,
  elementClass: CustomElementConstructor,
  options: ElementDefinitionOptions = {}
) => {
  customElements.define(name, elementClass, options);
};

export const getNodeName = (node: Attr) => node.name;

export const getNodeValue = (node: Attr) => node.value;

export const getAttrList = (element: Element) => element.attributes;

export const getAttr = (element: Element, attrName: string): string =>
  element.getAttribute(attrName) || "";

export const getHTML = (element: Element) => element.innerHTML;

export const getContent = (element: Element | ShadowRoot) =>
  element.textContent?.trim() ?? "";

export const setContent = (
  element: Element | ShadowRoot,
  content: string = ""
) => (element.textContent = content);

export const setHTML = (
  element: Element | ShadowRoot,
  content: string = ""
) => {
  element.innerHTML = content;
};

export const cleanHTML = (element: Element | ShadowRoot) =>
  setHTML(element, "");

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
    setAttr(toElement, nodeName, nodeValue || nodeName);
  });
};

export const attachShadow = (
  element: Element,
  mode: ShadowRootMode = "closed"
) => element.attachShadow({ mode });
