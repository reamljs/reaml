import { EventTypes } from "@utils/const";
import { getGlobalStates } from "@utils/state";
import { getHTML, getAttr } from "@utils/node";
import BaseElement from "@classes/BaseElement";

class StatesComponent extends BaseElement {
  initialValue: string;
  renderAs: string | undefined = undefined;

  constructor(statesName: string) {
    super(statesName);
    this.initialValue = getHTML(this);
  }

  connectedCallback() {
    this.parseRenderer();
    this.addVarsObserver(EventTypes.StatesUpdate, () => this.render());
    super.connectedCallback();
    this.mount();
  }

  parseRenderer() {
    this.renderAs = getAttr(this, "as");
  }

  render() {
    let value = getGlobalStates(this.statesName, this.initialValue);
    if (value === undefined) return;
    if (this.renderAs) {
      value =
        this.renderAs === "json"
          ? JSON.stringify(value, null, 2)
          : (<any>window)[this.renderAs](value);
    }

    const textNode = document.createTextNode(value);
    this.shadow.firstChild?.remove();
    this.shadow.appendChild(textNode);
  }

  mount() {
    this.render();
    this.setAttribute("value", this.initialValue);
    this.clean();
  }
}

export default StatesComponent;
