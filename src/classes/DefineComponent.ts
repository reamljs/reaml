import { Attributes, ElementTag, EventTypes } from "@utils/const";
import {
  createArray,
  parseValue,
  randomId,
  toPrimitiveObject,
} from "@utils/data";
import { global } from "@utils/helpers";
import {
  attachShadow,
  copyAttrs,
  createTag,
  getAttr,
  getAttrList,
  getHTML,
  setHTML,
} from "@utils/node";
import {
  createObserverFn,
  createRefFn,
  getREAMLObject,
  GlobalFunction,
} from "@utils/reaml";
import { createObserver, getSafeStates, listenStates } from "@utils/state";
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
  return class extends HTMLElement {
    id: string;
    props: any[];
    defaultProps: any[];
    proxyProps: any;
    shadow: ShadowRoot;

    constructor() {
      super();
      this.shadow = attachShadow(this);
      this.id = randomId();
      this.defaultProps = this.initDefaultProps();
      this.props = this.initProps();
      this.proxyProps = {};
    }

    connectedCallback() {
      this.listenObserver();
      this.mount();
      this.updateProps(global(statesName));
      this.createPropsObserver();
      this.removeUnusedProps();
      requestAnimationFrame(() => {
        this.appendScripts();
      });
    }

    listenObserver() {
      listenStates(statesName, (data) => {
        if (!this.isConnected) return;
        this.updateProps((<any>data)?.detail);
      });
    }

    createPropsObserver() {
      this.proxyProps = createObserver(this.proxyProps, () =>
        this.dispatchEvent(event)
      );
      const event = new CustomEvent(`${EventTypes.PropsUpdate}-${this.id}`, {
        detail: this.proxyProps,
      });
    }

    mount() {
      setHTML(this.shadow, html);
    }

    appendScripts() {
      const observerFnName = createObserverFn(this.id, name);
      const refFnName = createRefFn(this.id, name);

      const replacer = [
        [GlobalFunction.createObserver, observerFnName],
        [GlobalFunction.createRef, refFnName],
      ];

      global(refFnName, (querySelector: string) => {
        const shadow = this.shadow;
        if (!querySelector) return shadow;
        return shadow.querySelector(querySelector);
      });

      scripts.forEach((script) => {
        const newScriptElement = <HTMLScriptElement>(
          createTag(ElementTag.Script)
        );

        newScriptElement.type = Attributes.Module;
        copyAttrs(script, newScriptElement);

        let content = getHTML(script);
        const mountScript = (content: string) => {
          replacer.forEach(([search, replace]) => {
            content = content.replaceAll(search, replace).trim();
          });
          setHTML(newScriptElement, content);
          this.shadow.appendChild(newScriptElement);
        };

        if (content) {
          mountScript(content);
        } else {
          const scriptSrc = getAttr(script, Attributes.Src);
          if (scriptSrc) {
            newScriptElement.removeAttribute(Attributes.Src);
            fetch(scriptSrc)
              .then((response) => response.text())
              .then((content) => {
                mountScript(content);
              });
          }
        }
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
        const camelName = camelCase(name);
        if (!this.dataset[camelName] || value !== nextValue) {
          this.proxyProps[camelName] = nextValue;
          this.dataset[camelName] = nextValue;
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
            fn(states, toPrimitiveObject(this.proxyProps));
          });
      } catch (err) {}
    }
  };
};
