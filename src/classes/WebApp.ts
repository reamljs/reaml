import { CustomElement, EventTypes, Attributes } from "@utils/const";
import { getAttrList, getAttr, getHTML } from "@utils/node";
import { createObserver } from "@utils/state";
import { randomId } from "@utils/data";
import { global } from "@utils/helpers";
import BaseElement from "@classes/BaseElement";
import DefineComponent from "@classes/DefineComponent";
import StatesComponent from "@classes/StatesComponent";
import IfLogicComponent from "@classes/IfLogicComponent";

class WebApp extends BaseElement {
  id: string;

  constructor() {
    super();
    this.id = randomId();
  }

  connectedCallback() {
    this.mount();
    this.registerElements();
  }

  mount() {
    this.setStatesName(this.getOriginStatesName());
    this.setAttribute(Attributes.Id, this.id);
    this.createObservableStates();
    super.mount();
  }

  getOriginStatesName() {
    return getAttr(this, Attributes.States);
  }

  createObservableStates() {
    const statesName = this.getOriginStatesName();
    global(
      statesName,
      createObserver(global(statesName), () => document.dispatchEvent(event))
    );
    const event = new CustomEvent(EventTypes.StatesUpdate, {
      detail: global(statesName),
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
          tagAttributes: getAttrList(element),
          content: getHTML(element),
          statesName: this.statesName,
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
