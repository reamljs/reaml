import { EventTypes, Attributes } from "@utils/const";
import {
  createElement,
  getAttr,
  getAttrList,
  getNodeName,
  getNodeValue,
  setHTML,
  getHTML,
  cleanHTML,
  querySelectorAll,
} from "@utils/node";
import { createArray } from "@utils/data";

type ObserverCallback = (data?: any) => void;

class BaseElement extends HTMLElement {
  renderAs: string | undefined;
  shadow: ShadowRoot;
  statesName: string = Attributes.States;
  observers: [
    eventTypes: EventTypes,
    callback: ObserverCallback,
    target?: EventTarget
  ][];

  constructor(statesName?: string) {
    super();
    if (statesName) {
      this.setStatesName(statesName);
    }
    this.observers = [];
    this.shadow = this.attachShadow({ mode: "closed" });
  }

  setStatesName(statesName: string = Attributes.States) {
    this.statesName = statesName;
  }

  connectedCallback() {
    this.listenVarsObserver();
  }

  mount(customHTML?: string) {
    this.render(customHTML);
    this.clean();
  }

  render(customHTML?: string) {
    setHTML(this.shadow, customHTML || getHTML(this));
  }

  cleanShadow() {
    cleanHTML(this.shadow);
  }

  clean() {
    requestAnimationFrame(() => {
      cleanHTML(this);
    });
  }

  addVarsObserver(
    eventType: EventTypes,
    fn: ObserverCallback,
    target?: EventTarget
  ) {
    this.observers.push([eventType, fn, target]);
  }

  listenVarsObserver() {
    for (const [eventType, fn, eventTarget] of this.observers) {
      (eventTarget || document).addEventListener(eventType, (object?: any) => {
        fn(object?.detail);
      });
    }
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
    if (customElements.get(tag)) return;

    querySelectorAll(this.shadow, selector).forEach((node) => {
      const element = document.createElement(tag);
      createArray<Attr>(getAttrList(node)).forEach((attr) => {
        const nodeName = getNodeName(attr);
        const nodeValue = getNodeValue(attr);
        return element.setAttribute(
          getNodeName(attr),
          nodeValue ? nodeValue : nodeName
        );
      });
      setHTML(element, getHTML(node));
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

  parseRenderer() {
    this.renderAs = getAttr(this, "as");
  }
}

export default BaseElement;
