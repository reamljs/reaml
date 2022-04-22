import { Attributes, ElementTag } from "@utils/const";
import {
  copyAttrs,
  createElement,
  createTag,
  getAttr,
  getAttrList,
  getContent,
  getHTML,
  querySelectorAll,
  removeNode,
  setAttr,
  setHTML,
} from "@utils/node";
import createStateComponent from "@classes/StatesComponent";
// import createIfLogicComponent from "@classes/IfLogicComponent";
import createDefineState from "@classes/DefineState";
import createDefineComponent from "@classes/DefineComponent";
import { createArray } from "@utils/data";
import Reaml from "@classes/Reaml";

export default function createApp() {
  createElement(
    ElementTag.Main,
    class extends HTMLElement {
      constructor() {
        super();
        Reaml.init();

        if (!getAttr(this, Attributes.AppName))
          throw new Error("Invalid `web-app` component. App name is required.");
      }

      connectedCallback() {
        this.registerStaticComponent();
        this.registerDefineComponents();
        this.mount();
      }

      registerStaticComponent() {
        const args = {};

        (<[elementTag: string, fn: Function, classOptions: any][]>[
          [ElementTag.StatesComponent, createStateComponent, args],
          // [ElementTag.IfLogicComponent, createIfLogicComponent, args],
        ]).forEach(([tagName, fn, args]) => {
          const componentTag = `${tagName}-${Attributes.Component}`;
          createElement(componentTag, fn(args));

          createArray<Element>(querySelectorAll(this, tagName)).forEach(
            (node) => {
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
            }
          );
        });
      }

      registerDefineComponents() {
        const nodes: [
          node: Element,
          defineType: Attributes.State | Attributes.Component,
          componentTagOrStateName: string,
          attributes: NamedNodeMap
        ][] = [];

        createArray<Element>(
          querySelectorAll(this, ElementTag.DefineComponent)
        ).forEach((node) => {
          const componentAttr = getAttr(node, Attributes.Component);
          const stateAttr = getAttr(node, Attributes.State);
          if (!componentAttr && !stateAttr) return;

          const defineType = componentAttr
            ? Attributes.Component
            : Attributes.State;
          const componentTagOrStateName = componentAttr || stateAttr;
          const attributes = getAttrList(node);
          nodes.push([node, defineType, componentTagOrStateName, attributes]);
        });

        nodes.forEach(([node, defineType, name, attributes]) => {
          const content = getHTML(node);

          switch (defineType) {
            case Attributes.Component:
              createElement(
                name,
                createDefineComponent({
                  name,
                  html: content,
                  attributes,
                })
              );
              removeNode(node);
              break;

            case Attributes.State:
              createDefineState({
                name,
                node,
                content,
              });
              break;
          }
        });
      }

      mount() {
        Reaml.isReady();
      }
    }
  );
}
