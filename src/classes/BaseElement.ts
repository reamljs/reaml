import { EventTypes, Attributes } from "@utils/const";
import {
  createElement,
  getAttr,
  setHTML,
  getHTML,
  cleanHTML,
  querySelectorAll,
  createTag,
  copyAttrs,
} from "@utils/node";

type ObserverCallback = (data?: any) => void;

type CreateElementOptions = {
  elementTag: string;
  elementSelector: string;
  elementClass: CustomElementConstructor;
  args?: any;
};

type CrateDeepElementOptions = Omit<CreateElementOptions, "elementTag"> & {
  isCleanup?: boolean;
  iteratorCallback?: (element: Element) => {
    elementTag?: string;
    [key: string]: any;
  };
};

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

  createDeepElement({
    elementSelector,
    elementClass,
    isCleanup = true,
    iteratorCallback = () => ({ tag: undefined }),
  }: CrateDeepElementOptions) {
    const cleanupDOM = (node: Element) => {
      cleanHTML(node);
      node.remove();
    };

    const getDefineElement = (element: ShadowRoot | Element) =>
      querySelectorAll(element, elementSelector);

    const elements: [string, Element][] = [];
    getDefineElement(this.shadow).forEach((element) => {
      const args = iteratorCallback(element);
      const elementTag = args.elementTag;
      delete args.elementTag;

      if (!elementTag) return;
      if (customElements.get(elementTag)) return;

      if (isCleanup) {
        getDefineElement(element).forEach(cleanupDOM);
      }

      createElement(
        elementTag,
        class extends elementClass {
          constructor() {
            super(args);
          }
        }
      );

      elements.push([elementTag, element]);
      if (isCleanup) {
        cleanupDOM(element);
      }
    });

    return elements;
  }

  createStaticElement({
    elementTag,
    elementSelector,
    elementClass,
    args = {},
  }: CreateElementOptions) {
    if (customElements.get(elementTag)) return;

    querySelectorAll(this.shadow, elementSelector).forEach((node) => {
      const element = createTag(elementTag);
      copyAttrs(node, element);
      setHTML(element, getHTML(node));
      node.parentNode?.replaceChild(element, node);
      node.parentNode?.removeChild(node);
    });
    createElement(
      elementTag,
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
