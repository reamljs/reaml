import { Attributes, ElementTag, EventTypes } from "@utils/const";
import {
  createElement,
  getAttr,
  getAttrList,
  getHTML,
  querySelectorAll,
} from "@utils/node";
import createDefineComponentd from "@classes/DefineComponent";
import { createArray } from "@utils/data";
import { global } from "@utils/helpers";
import { createObserver } from "@utils/state";

export default class extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.createStatesObserver();
    this.registerStateComponent();
    this.registerDefineComponents();
  }

  getStatesName() {
    return getAttr(this, Attributes.States) || Attributes.States;
  }

  createStatesObserver() {
    const statesName = this.getStatesName();
    const event = new CustomEvent(`${EventTypes.StatesUpdate}-${statesName}`, {
      detail: global(statesName),
    });
    global(
      statesName,
      createObserver(global(statesName), () => document.dispatchEvent(event))
    );
  }

  registerStateComponent() {}

  registerDefineComponents() {
    const removeNode = (node: Element) => {
      node.remove();
      // @ts-ignore
      node = null;
    };

    const nodes: [
      componentName: string,
      attributes: NamedNodeMap,
      node: Element,
      scripts: Element[]
    ][] = [];

    createArray<Element>(
      querySelectorAll(this, ElementTag.DefineComponent)
    ).forEach((node) => {
      const tagName = getAttr(node, Attributes.Component);
      if (!tagName) return;

      const attributes = getAttrList(node);
      const scripts: Element[] = [];
      querySelectorAll(node, ElementTag.DefineComponent).forEach(removeNode);
      querySelectorAll(node, ElementTag.Script).forEach((script) => {
        scripts.push(script);
        removeNode(script);
      });
      nodes.push([tagName.toLowerCase(), attributes, node, scripts]);
      removeNode(node);
    });

    nodes.forEach(([componentName, attributes, node, scripts]) => {
      createElement(
        componentName,
        createDefineComponentd({
          name: componentName,
          statesName: this.getStatesName(),
          html: getHTML(node),
          attributes,
          scripts,
        })
      );
    });
  }
}
