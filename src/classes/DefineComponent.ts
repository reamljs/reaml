import BaseElement from "@classes/BaseElement";
import { CustomElement } from "@utils/const";

class DefineComponent extends BaseElement {
  constructor(html: string) {
    super(html);
    this.render();
    this.removeSubComponents();
  }

  removeSubComponents() {
    this.shadow
      .querySelectorAll(CustomElement.DefineComponent)
      .forEach((el) => {
        el.parentNode?.removeChild(el);
      });
  }
}

export default DefineComponent;
