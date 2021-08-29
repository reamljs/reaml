import { EventTypes, Attributes } from "@utils/const";
import { createElement } from "@utils/node";

type StatesObserverCallback = () => void;

class BaseElement extends HTMLElement {
  shadow: ShadowRoot;
  statesName: string = Attributes.States;
  oberverCallbacks: StatesObserverCallback[] = [];

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
    this.oberverCallbacks.push(fn);
  }

  connectStatesObserver() {
    document.addEventListener(EventTypes.StatesUpdate, () => {
      for (const fn of this.oberverCallbacks) {
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
      Array.from(node.attributes).forEach((attr) =>
        element.setAttribute(
          attr.nodeName,
          attr.nodeValue ? attr.nodeValue : attr.nodeName
        )
      );
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
}

export default BaseElement;
