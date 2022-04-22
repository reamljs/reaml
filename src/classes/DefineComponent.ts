type Component = {
  props: any;
  template: string;
};

export const TagName = "define-component";

const definedComponents = new Map<string, Component>();

const registerComponent = (tagName: string) => {
  let shadowRoot: ShadowRoot;

  const component = definedComponents.get(tagName);
  if (!component) throw new Error(`Component \`${tagName}\` doesn't exists`);

  customElements.define(
    tagName,
    class extends HTMLElement {
      constructor() {
        super();
        shadowRoot = this.attachShadow({ mode: "closed" });
        shadowRoot.innerHTML = component?.template ?? "";
      }
    }
  );
};

const registerDefineComponent = () => {
  let shadowRoot: ShadowRoot;

  customElements.define(
    TagName,
    class extends HTMLElement {
      constructor() {
        super();
        const tagName = this.getAttribute("name");
        if (!tagName) throw new Error("Please set component name.");

        const isExists = definedComponents.get(tagName);
        if (isExists)
          throw new Error(`Component \`${tagName}\` already defined.`);

        shadowRoot = this.attachShadow({ mode: "closed" });

        this.querySelectorAll(`:scope > ${TagName}`).forEach(
          (element) => {
            element.remove();
          }
        );

        definedComponents.set(tagName, {
          props: {},
          template: this.innerHTML,
        });

        requestAnimationFrame(() => {
          registerComponent(tagName);
        });
      }

      connectedCallback() {
        this.remove();
      }
    }
  );
};

export default registerDefineComponent;
