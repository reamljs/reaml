import { CustomElement, EventTypes, Attributes } from "@utils/const";
import {
  createElement,
  getAttrList,
  getAttr,
  getHTML,
  cleanHTML,
} from "@utils/node";
import { createStates } from "@utils/state";
import BaseElement from "@classes/BaseElement";
import DefineComponent from "@classes/DefineComponent";
import StatesComponent from "@classes/StatesComponent";
import IfLogicComponent from "@classes/IfLogicComponent";

class WebApp extends BaseElement {
  constructor() {
    super();
    this.setStatesName(this.getOriginStatesName());
  }

  connectedCallback() {
    super.connectedCallback();
    this.mount();
    this.createGlobalStates();
    this.registerElements();
  }

  getOriginStatesName() {
    return getAttr(this, Attributes.States);
  }

  createGlobalStates() {
    const event = new CustomEvent(EventTypes.StatesUpdate, {
      detail: {
        time: Date.now(),
      },
    });

    const statesName = this.getOriginStatesName();
    (<any>window)[statesName] = createStates((<any>window)[statesName], () => {
      document.dispatchEvent(event);
    });
  }

  registerElements() {
    this.registerScopedComponents();
    this.registerDefinesComponent();
  }

  registerDefinesComponent() {
    const cleanupDOM = (node: Element) => {
      cleanHTML(node);
      node.remove();
    };

    const getDefineElement = (element: ShadowRoot | Element) =>
      element.querySelectorAll(CustomElement.DefineComponent);

    const statesName = this.statesName;

    getDefineElement(this.shadow).forEach((element) => {
      const attributes = getAttrList(element);
      const html = getHTML(element);
      getDefineElement(element).forEach(cleanupDOM);
      createElement(
        getAttr(element, Attributes.Component),
        class extends DefineComponent {
          constructor() {
            super(statesName, html, attributes);
          }
        }
      );
      cleanupDOM(element);
    });
  }

  registerScopedComponents() {
    (<[string, CustomElementConstructor][]>[
      [CustomElement.StatesComponent, StatesComponent],
      [CustomElement.IfLogicComponent, IfLogicComponent],
    ]).forEach(([selector, elementClass]) => {
      this.createScopedElement({
        selector,
        elementClass,
        tag: `${selector}-${Attributes.Component}`,
        args: this.statesName,
      });
    });
  }
}

export default WebApp;
