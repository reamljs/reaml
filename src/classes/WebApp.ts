import { CustomElement, EventTypes, Attributes } from "@utils/const";
import {
  createElement,
  getAttrList,
  getAttr,
  getHTML,
  cleanHTML,
  querySelectorAll,
} from "@utils/node";
import { createObserver } from "@utils/state";
import BaseElement from "@classes/BaseElement";
import DefineComponent from "@classes/DefineComponent";
import StatesComponent from "@classes/StatesComponent";
import PropsComponent from "@classes/PropsComponent";
import IfLogicComponent from "@classes/IfLogicComponent";

class WebApp extends BaseElement {
  constructor() {
    super();
    this.setStatesName(this.getOriginStatesName());
  }

  connectedCallback() {
    super.connectedCallback();
    this.createObservableStates();
    this.mount();
    this.registerElements();
  }

  getOriginStatesName() {
    return getAttr(this, Attributes.States);
  }

  createObservableStates() {
    const statesName = this.getOriginStatesName();
    (<any>window)[statesName] = createObserver((<any>window)[statesName], () =>
      document.dispatchEvent(event)
    );
    const event = new CustomEvent(EventTypes.StatesUpdate, {
      detail: (<any>window)[statesName],
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
      querySelectorAll(element, CustomElement.DefineComponent);

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
      [CustomElement.PropsComponent, PropsComponent],
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
