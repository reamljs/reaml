import { EventTypes, Attributes } from "@utils/const";
import {
  createElement,
  getAttrList,
  getNodeName,
  getNodeValue,
  setHTML,
  getHTML,
  cleanHTML,
} from "@utils/node";
import { createArray } from "@utils/data";

type ObserverCallback = () => void;

class BaseElement extends HTMLElement {
  shadow: ShadowRoot;
  statesName: string = Attributes.States;
  observers: [
    eventTypes: EventTypes,
    callback: ObserverCallback,
    target?: EventTarget
  ][] = [];

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
      (eventTarget || document).addEventListener(eventType, () => {
        fn();
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
    this.shadow.querySelectorAll(selector).forEach((node) => {
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
}

export default BaseElement;
