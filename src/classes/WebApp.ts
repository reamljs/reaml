import { createElement, createScopedElement } from "@utils/node";
import BaseElement from "@classes/BaseElement";
import DefineComponent from "@classes/DefineComponent";
import IfLogicComponent from "@classes/IfLogicComponent";
import ForLogicComponent from "@classes/ForLogicComponent";
import { CustomElement, Attributes } from "@utils/const";

class WebApp extends BaseElement {
  constructor() {
    super();
    this.registerElements();
    this.render();
  }

  registerElements() {
    this.addTraversalCallback(this.registerDefineComponents);
    this.addTraversalCallback(this.registerIfLogicComponents);
    this.addTraversalCallback(this.registerForLogicComponents);
  }

  registerDefineComponents(shadow: ShadowRoot) {
    shadow.querySelectorAll(CustomElement.DefineComponent).forEach((node) => {
      node.parentNode?.removeChild(node);
      createElement(
        <string>node.getAttribute(Attributes.Component),
        class extends DefineComponent {
          constructor() {
            super(node.innerHTML);
          }
        }
      );
    });
  }

  registerIfLogicComponents(shadow: ShadowRoot) {
    createScopedElement({
      shadow,
      tag: `${CustomElement.IfLogicComponent}-${Attributes.Component}`,
      selector: CustomElement.IfLogicComponent,
      elementClass: IfLogicComponent,
    });
  }

  registerForLogicComponents(shadow: ShadowRoot) {
    createScopedElement({
      shadow,
      tag: `${CustomElement.ForLogicComponent}-${Attributes.Component}`,
      selector: CustomElement.ForLogicComponent,
      elementClass: ForLogicComponent,
    });
  }
}

export default WebApp;
