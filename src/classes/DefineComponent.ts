import { Attributes, ElementTag, EventTypes } from "@utils/const";
import { createArray, randomId } from "@utils/data";
import {
  attachShadow,
  getAttr,
  getAttrList,
  querySelectorAll,
  removeNode,
  renderOnConnected,
  setHTML,
} from "@utils/node";
import { createObserver } from "@utils/state";

type DefineComponentOptions = {
  name: string;
  html: string;
  attributes: NamedNodeMap;
};

export default function createDefineComponent({
  html,
  attributes,
}: DefineComponentOptions) {
  const shadowRoots = new WeakMap();
  const mappedAttr = ({ name, value }: Attr) => [name, value];

  return class extends HTMLElement {
    id: string;
    props: any[];
    defaultProps: any[];
    proxyProps: any;

    constructor() {
      super();
      shadowRoots.set(this, attachShadow(this));
      this.id = randomId();
      this.defaultProps = this.initDefaultProps();
      this.props = this.initProps();
      this.proxyProps = {};
    }

    connectedCallback() {
      this.mount();
      this.removeNestedComponent();
      this.createPropsObserver();
      this.removeUnusedProps();
    }

    createPropsObserver() {
      this.proxyProps = createObserver(this.proxyProps, () =>
        this.dispatchEvent(event)
      );
      const event = new CustomEvent(`${EventTypes.PropsUpdate}-${this.id}`, {
        detail: this.proxyProps,
      });
    }

    removeNestedComponent() {
      querySelectorAll(
        shadowRoots.get(this),
        ElementTag.DefineComponent
      ).forEach((node) => {
        if (!getAttr(node, Attributes.State)) {
          removeNode(node);
        }
      });
    }

    mount() {
      const shadow = shadowRoots.get(this);
      renderOnConnected(shadow, () => {
        setHTML(shadow, html);
      });
    }

    // appendScripts() {
    //   const { placeholder } = this.getSyntaxPlaceholder();

    //   scripts.forEach((script) => {
    //     const newScriptElement = <HTMLScriptElement>(
    //       createTag(ElementTag.Script)
    //     );

    //     newScriptElement.type = Attributes.Module;
    //     copyAttrs(script, newScriptElement);

    //     let content = getHTML(script);
    //     const mountScript = (content: string) => {
    //       placeholder.forEach(([search, replace]) => {
    //         content = content.replaceAll(search, replace).trim();
    //       });
    //       setHTML(newScriptElement, content);
    //       this.shadow.appendChild(newScriptElement);
    //     };

    //     if (content) {
    //       mountScript(content);
    //     } else {
    //       const scriptSrc = getAttr(script, Attributes.Src);
    //       if (scriptSrc) {
    //         newScriptElement.removeAttribute(Attributes.Src);
    //         fetch(scriptSrc)
    //           .then((response) => response.text())
    //           .then((content) => {
    //             mountScript(content);
    //           });
    //       }
    //     }
    //   });
    // }

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
  };
}
