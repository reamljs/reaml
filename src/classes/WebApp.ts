import { CustomElement, EventTypes, Attributes } from "@utils/const";
import { createElement, createScopedElement } from "@utils/node";
import { createStates } from "@utils/state";
import BaseElement from "@classes/BaseElement";
import DefineComponent from "@classes/DefineComponent";
import StatesComponent from "@classes/StatesComponent";
import IfLogicComponent from "@classes/IfLogicComponent";

class WebApp extends BaseElement {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.mount();
    this.createGlobalStates();
    this.registerElements();
  }

  createGlobalStates() {
    const event = new CustomEvent(EventTypes.StatesUpdate, {
      detail: {
        time: Date.now(),
      },
    });

    (<any>window).states = createStates((<any>window).states, () => {
      document.dispatchEvent(event);
    });
  }

  registerElements() {
    this.registerScopedComponents();
    this.registerDefinesComponent();
  }

  registerDefinesComponent() {
    const cleanupDOM = (node: Element) => {
      node.innerHTML = "";
      node.remove();
    };

    const getDefineElement = (element: ShadowRoot | Element) =>
      element.querySelectorAll(CustomElement.DefineComponent);

    getDefineElement(this.shadow).forEach((element) => {
      const { innerHTML: html, attributes } = element;
      getDefineElement(element).forEach(cleanupDOM);
      createElement(
        <string>element.getAttribute(Attributes.Component),
        class extends DefineComponent {
          constructor() {
            super(html, attributes);
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
      createScopedElement({
        selector,
        elementClass,
        tag: `${selector}-${Attributes.Component}`,
        shadow: this.shadow,
      });
    });
  }
}

export default WebApp;
