import { Attributes, ElementTag, EventTypes } from "@utils/const";
import { createArray, parseValue, randomId } from "@utils/data";
import { global } from "@utils/helpers";
import {
  copyAttrs,
  createTag,
  getAttrList,
  getHTML,
  setHTML,
} from "@utils/node";
import { createObserverFn, getREAMLObject, GlobalFunction } from "@utils/reaml";
import { getSafeStates } from "@utils/state";
import { camelCase } from "@utils/string";

type DefineComponentOptions = {
  name: string;
  html: string;
  statesName: string;
  attributes: NamedNodeMap;
  scripts: Element[];
};

export default ({
  name,
  statesName,
  html,
  attributes,
  scripts,
}: DefineComponentOptions) => {
  const mappedAttr = ({ name, value }: Attr) => [name, value];
  let shadow: ShadowRoot;

  return class extends HTMLElement {
    id: string;
    props: any[];
    defaultProps: any[];

    constructor() {
      super();
      shadow = this.attachShadow({ mode: "closed" });
      this.id = randomId();
      this.defaultProps = this.initDefaultProps();
      this.props = this.initProps();
    }

    connectedCallback() {
      this.listenObserver();
      this.mount();
      this.createPropsObserver();
      this.updateProps(global(statesName));
      this.removeUnusedProps();
      this.appendScripts();
    }

    listenObserver() {
      document.addEventListener(
        `${EventTypes.StatesUpdate}-${statesName}`,
        (data) => {
          this.updateProps((<any>data)?.detail);
        }
      );
    }

    createPropsObserver() {}

    mount() {
      setHTML(shadow, html);
    }

    appendScripts() {
      const observerFnName = createObserverFn(this.id, name);
      if (!observerFnName) return;

      scripts.forEach((script) => {
        const newScriptElement = <HTMLScriptElement>(
          createTag(ElementTag.Script)
        );
        newScriptElement.type = "module";
        copyAttrs(script, newScriptElement);
        const content = getHTML(script);
        if (content) {
          setHTML(
            newScriptElement,
            content
              .replaceAll(GlobalFunction.createObserver, observerFnName)
              .trim()
          );
        }
        shadow.appendChild(newScriptElement);
      });
    }

    initProps() {
      return createArray<Attr>(getAttrList(this)).map(mappedAttr);
    }

    initDefaultProps() {
      const exceptionProps: string[] = [Attributes.Component];
      return createArray<Attr>(attributes)
        .filter(({ name }) => !exceptionProps.includes(name))
        .map(mappedAttr);
    }

    removeUnusedProps() {
      createArray<Attr>(getAttrList(this)).forEach((item) => {
        if (!item.name.includes("data-")) {
          this.removeAttribute(item.name);
        }
      });
    }

    updateProps(states?: any) {
      const props: any = {};
      [...this.defaultProps, ...this.props]
        .map(([name, value]) => ({
          name,
          value,
        }))
        .forEach(({ name, value }) => {
          props[name] = value;
        });

      Object.keys(props).forEach((name) => {
        const value = props[name];
        const nextValue = parseValue(
          getSafeStates(statesName, states, value) ?? value
        );
        if (!this.dataset[camelCase(name)] || value !== nextValue) {
          this.dataset[camelCase(name)] = nextValue;
        }
      });

      this.invokeUpdate(states);
    }

    invokeUpdate(states?: any) {
      try {
        const reaml = getREAMLObject();
        reaml.fx[name]
          .filter((item) => item[0] === this.id)
          .forEach(([_, fn]) => {
            fn(states, {});
          });
      } catch (err) {}
    }
  };
};
