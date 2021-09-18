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
import { createArray } from "@utils/data";
import { addREAMLFn } from "@utils/reaml";

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

type Observer = [
  eventType: EventTypes,
  eventTarget: EventTarget,
  callback: () => void
];

class BaseElement extends HTMLElement {
  renderAs: string | undefined;
  shadow: ShadowRoot;
  statesName: string = Attributes.States;
  observers: Observer[];

  constructor(statesName?: string, mode: ShadowRootMode = "closed") {
    super();
    this.observers = [];
    if (statesName) this.setStatesName(statesName);
    this.shadow = this.attachShadow({ mode });
  }

  disconnectedCallback() {
    if (this.parentNode) {
      Array.from(this.parentNode.children).forEach((node) => {
        if (node.isSameNode(this)) {
          // @ts-ignore
          node = null;
        }
      });
    }
    this.observers.forEach(([eventType, eventTarget, callback]) => {
      (eventTarget || document).removeEventListener(eventType, callback);
    });
  }

  setStatesName(statesName: string = Attributes.States) {
    this.statesName = statesName;
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
    eventTarget: EventTarget = document
  ) {
    const callback = (object?: any) => {
      fn(object?.detail);
    };

    (eventTarget || document).addEventListener(eventType, callback);
    this.observers.push([eventType, eventTarget, callback]);
  }

  cloneElement(
    element: Element | ShadowRoot,
    selector: string,
    isRemoveNode?: boolean
  ) {
    const getElement = (element: ShadowRoot | Element | Document) =>
      element.querySelectorAll(selector);

    const removeElement = (element: Element) => {
      element.remove();
    };

    const elements: [Element, Node[]][] = [];
    getElement(element).forEach((node) => {
      const temp = createTag(selector);
      const scripts: Node[] = [];
      createArray<HTMLScriptElement>(querySelectorAll(node, "script")).forEach(
        (item) => {
          console.log(item.textContent);
          scripts.push(item.cloneNode());
          item.remove();
        }
      );
      setHTML(temp, getHTML(node));
      copyAttrs(node, temp);
      getElement(temp).forEach(removeElement);
      elements.push([temp, scripts]);
      // @ts-ignore
      removeElement(node);
    });

    return elements;
  }

  createDeepElement({
    isRemoveNode = true,
    elementSelector,
    elementClass,
    iteratorCallback = () => ({ tag: undefined }),
  }: CrateDeepElementOptions) {
    const elements = this.cloneElement(
      this.shadow,
      elementSelector,
      isRemoveNode
    );

    elements.forEach(([element, scripts]) => {
      const args = iteratorCallback(element);
      if (!args.elementTag) return;

      const elementTag = args.elementTag;
      delete args.elementTag;

      if (!customElements.get(elementTag)) {
        args.scripts = scripts;
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
        // @ts-ignore
        element = null;
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
      node.remove();
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
