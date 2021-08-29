import { EventTypes, Attributes } from "@utils/const";
import { createElement, getAttributes } from "@utils/node";
import { createArray } from "@utils/data";

type StatesObserverCallback = () => void;

class BaseElement extends HTMLElement {
  shadow: ShadowRoot;
  statesName: string = Attributes.States;
  observerFn: StatesObserverCallback[] = [];

  constructor(statesName?: string) {
    super();
    if (statesName) {
      this.setStatesName(statesName);
    }
    this.shadow = this.attachShadow({ mode: "closed" });
  }

  setStatesName(statesName: string = Attributes.States) {
    this.statesName = statesName;
  }

  connectedCallback() {
    this.connectStatesObserver();
  }

  mount(customHTML?: string) {
    this.render(customHTML);
    this.clean();
  }

  render(customHTML?: string) {
    this.setHTML(customHTML || this.getHTML(), this.shadow);
  }

  cleanShadow() {
    this.setHTML("", this.shadow);
  }

  clean() {
    requestAnimationFrame(() => {
      this.setHTML("");
    });
  }

  addStatesObserver(fn: StatesObserverCallback) {
    this.observerFn.push(fn);
  }

  connectStatesObserver() {
    document.addEventListener(EventTypes.StatesUpdate, () => {
      for (const fn of this.observerFn) {
        fn();
      }
    });
  }

  createScopedElement({
    tag,
    selector,
    elementClass,
    args = {},
  }: {
    tag: string;
    selector: string;
    elementClass: CustomElementConstructor;
    args?: any;
  }) {
    this.shadow.querySelectorAll(selector).forEach((node) => {
      const element = document.createElement(tag);
      createArray<Attr>(getAttributes(node)).forEach((attr) => {
        const nodeName = this.getNodeName(attr);
        const nodeValue = this.getNodeValue(attr);
        return element.setAttribute(
          this.getNodeName(attr),
          nodeValue ? nodeValue : nodeName
        );
      });
      this.setHTML(this.getHTML(node), element);
      node.parentNode?.replaceChild(element, node);
      node.parentNode?.removeChild(node);
    });
    createElement(
      tag,
      class extends elementClass {
        constructor() {
          super(args);
        }
      }
    );
  }

  getHost() {
    return (<Node & { host: Node }>this.getRootNode()).host;
  }

  getAttrVal(attrName: string, element?: Element) {
    return (element || this).getAttribute(attrName);
  }

  getHTML(element?: Element) {
    return (element || this).innerHTML;
  }

  setHTML(content: string, element?: Element | ShadowRoot) {
    (element || this).innerHTML = content;
  }

  getNodeName(node: Node | Attr) {
    return node.nodeName;
  }

  getNodeValue(node: Node | Attr) {
    return node.nodeValue;
  }
}

export default BaseElement;
