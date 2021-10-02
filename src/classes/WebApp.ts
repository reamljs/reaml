import { Attributes, ElementTag, EventTypes } from "@utils/const";
import {
  copyAttrs,
  createElement,
  createTag,
  getAttr,
  getAttrList,
  getHTML,
  getContent,
  querySelectorAll,
  setAttr,
  setHTML,
} from "@utils/node";
import createStateComponent from "@classes/StatesComponent";
import createIfLogicComponent from "@classes/IfLogicComponent";
import createDefineComponent from "@classes/DefineComponent";
import { createArray } from "@utils/data";
import { global } from "@utils/helpers";
import { createObserver } from "@utils/state";

export default class extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.createStatesObserver();
    this.registerStaticComponents();
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

  registerStaticComponents() {
    const args = {
      statesName: this.getStatesName(),
    };

    (<[elementTag: string, fn: Function, classOptions: any][]>[
      [ElementTag.StatesComponent, createStateComponent, args],
      [ElementTag.IfLogicComponent, createIfLogicComponent, args],
    ]).forEach(([tagName, fn, args]) => {
      const componentTag = `${tagName}-${Attributes.Component}`;
      createElement(componentTag, fn(args));

      createArray<Element>(querySelectorAll(this, tagName)).forEach((node) => {
        const component = createTag(componentTag);
        copyAttrs(node, component);

        if (tagName === ElementTag.StatesComponent) {
          const text = getContent(node);
          if (text) setAttr(component, Attributes.Value, text);
        }

        if (tagName === ElementTag.IfLogicComponent) {
          setHTML(component, getHTML(node));
        }

        node.replaceWith(component);
      });
    });
  }

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
        createDefineComponent({
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
