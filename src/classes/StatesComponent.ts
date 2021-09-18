import { EventTypes, Attributes } from "@utils/const";
import { getGlobalStates, getStates } from "@utils/state";
import { getContent } from "@utils/node";
import { renderValueAs } from "@utils/helpers";
import BaseElement from "@classes/BaseElement";

class StatesComponent extends BaseElement {
  initialValue: string;

  constructor(statesName: string) {
    super(statesName);
    this.initialValue = getContent(this);
  }

  connectedCallback() {
    this.parseRenderer();
    this.addObservers();
    this.mount();
  }

  addObservers() {
    this.addVarsObserver(EventTypes.StatesUpdate, (states) =>
      this.render(states)
    );
  }

  mount() {
    this.render();
    this.setAttribute(Attributes.Value, this.initialValue);
    this.clean();
  }

  render(states?: any) {
    let value = states
      ? getStates(states, this.initialValue)
      : getGlobalStates(this.statesName, this.initialValue);
    if (value === undefined) return;
    if (this.renderAs) {
      value = renderValueAs(value, this.renderAs);
    }

    const textNode = document.createTextNode(value);
    this.shadow.firstChild?.remove();
    this.shadow.appendChild(textNode);
  }
}

export default StatesComponent;
