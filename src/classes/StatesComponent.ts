import { getGlobalStates } from "@utils/state";
import BaseElement from "@classes/BaseElement";

class StatesComponent extends BaseElement {
  initialValue: string;
  renderAs: string | undefined = undefined;

  constructor(statesName: string) {
    super(statesName);
    this.initialValue = this.getHTML();
  }

  connectedCallback() {
    this.parseRenderer();
    this.addStatesObserver(() => {
      this.render();
    });
    super.connectedCallback();
    this.mount();
  }

  parseRenderer() {
    this.renderAs = <string>this.getAttrVal("as");
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
