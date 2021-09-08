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
  isRemoveNode?: boolean;
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

  constructor(statesName?: string, mode: ShadowRootMode = "closed") {
    super();
    if (statesName) {
      this.setStatesName(statesName);
    }
    this.observers = [];
    this.shadow = this.attachShadow({ mode });
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
    target: EventTarget = document
  ) {
    this.observers.push([eventType, fn, target]);
  }

  listenVarsObserver() {
    document.addEventListener(EventTypes.StatesUpdate, (object?: any) => {
      this.observers
        .filter(([eventType]) => eventType === EventTypes.StatesUpdate)
        .forEach(([, fn]) => {
          fn(object?.detail);
        });
    });

    for (const [eventType, fn, eventTarget] of this.observers.filter(
      ([eventType]) => eventType === EventTypes.PropsUpdate
    )) {
      (eventTarget || document).addEventListener(eventType, (object?: any) => {
        fn(object?.detail);
      });
    }
  }

  createDeepElement({
    isRemoveNode = true,
    elementSelector,
    elementClass,
    iteratorCallback = () => ({ tag: undefined }),
  }: CrateDeepElementOptions) {
    const getElement = (element: ShadowRoot | Element | Document) =>
      element.querySelectorAll(elementSelector);

    const removeElement = (element: Element) => {
      element.remove();
    };

    getElement(this.shadow).forEach((node) => {
      if (isRemoveNode) {
        getElement(node).forEach(removeElement);
      }

      const args = iteratorCallback(node);
      if (!args.elementTag) return;

      const elementTag = args.elementTag;
      delete args.elementTag;

      if (!customElements.get(elementTag)) {
        createElement(
          elementTag,
          class extends elementClass {
            constructor() {
              super(args);
            }
          }
        );
      }

      if (isRemoveNode) {
        removeElement(node);
      }
    });
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
