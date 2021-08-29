import { getGlobalStates } from "@utils/state";
import { EventTypes } from "@utils/const";
import BaseElement from "@classes/BaseElement";

class StatesComponent extends BaseElement {
  initialValue: string;
  renderAs: string | undefined = undefined;

  constructor() {
    super();
    this.initialValue = this.innerHTML;
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
    this.renderAs = <string>this.getAttribute("as");
  }

  render() {
    let value = getGlobalStates(this.initialValue);
    if (value === undefined) return;

    switch (this.renderAs) {
      case "json":
        value = JSON.stringify(value, null, 2);
        break;

      default:
        if (this.renderAs) {
          value = (<any>window)[this.renderAs](value);
        }
        break;
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
