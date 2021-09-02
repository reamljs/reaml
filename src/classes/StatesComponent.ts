import { EventTypes, Attributes } from "@utils/const";
import { getGlobalStates, getStates } from "@utils/state";
import { getHTML } from "@utils/node";
import { renderValueAs } from "@utils/fn";
import BaseElement from "@classes/BaseElement";

class StatesComponent extends BaseElement {
  initialValue: string;

  constructor(statesName: string) {
    super(statesName);
    this.initialValue = getHTML(this);
  }

  connectedCallback() {
    this.parseRenderer();
    this.addVarsObserver(EventTypes.StatesUpdate, (states) =>
      this.render(states)
    );
    super.connectedCallback();
    this.mount();
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

  mount() {
    this.render();
    this.setAttribute(Attributes.Value, this.initialValue);
    this.clean();
  }
}

export default StatesComponent;
