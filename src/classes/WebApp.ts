import { CustomElement, EventTypes, Attributes } from "@utils/const";
import { getAttrList, getAttr, getHTML } from "@utils/node";
import { createObserver } from "@utils/state";
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
    (<[string, CustomElementConstructor][]>[
      [CustomElement.StatesComponent, StatesComponent],
      [CustomElement.IfLogicComponent, IfLogicComponent],
    ]).forEach(([elementSelector, elementClass]) => {
      this.createStaticElement({
        elementSelector,
        elementClass,
        elementTag: `${elementSelector}-${Attributes.Component}`,
        args: this.statesName,
      });
    });

    (<[string, CustomElementConstructor, (element: Element) => any][]>[
      [
        CustomElement.DefineComponent,
        DefineComponent,
        (element) => ({
          elementTag: getAttr(element, Attributes.Component),
          statesName: this.statesName,
          tagAttributes: getAttrList(element),
          content: getHTML(element),
        }),
      ],
    ]).forEach(([elementSelector, elementClass, iteratorCallback]) => {
      this.createDeepElement({
        elementSelector,
        elementClass,
        iteratorCallback,
      });
    });
  }
}

export default WebApp;
