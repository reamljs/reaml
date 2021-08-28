import BaseElement from "@classes/BaseElement";
import { CustomElement } from "@utils/const";

class DefineComponent extends BaseElement {
  constructor(html: string) {
    super();
    this.removeSubComponents();
    this.render(html);
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
