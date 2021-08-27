import { createScopedElement } from "@utils/node";
import { CustomElement } from "@utils/const";
import { getSafeStates } from "@utils/state";
import BaseElement from "@classes/BaseElement";
import LoopComponent from "@classes/LoopComponent";

class ForLogicComponent extends BaseElement {
  loopKey: string;

  constructor() {
    super();
    const [, , ...loopKey] = Math.random().toString().split("");
    this.loopKey = loopKey.join("");
    this.rawHTML = this.innerHTML;
    this.cleanDOM();
    this.registerElements();
    this.render();
  }

  registerElements() {
    this.addTraversalCallback((shadow: ShadowRoot) =>
      this.registerLoopComponent(shadow)
    );
  }

  registerLoopComponent(shadow: ShadowRoot) {
    const values = getSafeStates(
      this.states,
      <string>this.getAttribute("each")
    );
    createScopedElement({
      shadow,
      tag: `${CustomElement.LoopComponent}-${this.loopKey}`,
      selector: CustomElement.LoopComponent,
      elementClass: class extends LoopComponent {
        constructor() {
          super(values);
        }
      },
    });
  }
}

export default ForLogicComponent;
