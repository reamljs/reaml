import { Attributes, EventTypes } from "@utils/const";
import BaseElement from "@classes/BaseElement";
import { IDefineComponent } from "@classes/DefineComponent";

type PropsComponentInitialValue = {
  elementHost: IDefineComponent;
  content: string;
};

class PropsComponent extends BaseElement {
  elementHost: EventTarget | IDefineComponent;
  initialValue: string;
  props: any;

  constructor({ content, elementHost }: PropsComponentInitialValue) {
    super();
    this.initialValue = content;
    this.elementHost = elementHost;
    this.props = Object.assign(
      Object.assign({}, elementHost?.defaultProps ?? {}),
      elementHost?.proxyProps ?? {}
    );
  }

  connectedCallback() {
    this.parseRenderer();
    this.addVarsObserver(
      EventTypes.PropsUpdate,
      (props) => {
        this.props = Object.assign(this.props, props);
        this.render();
      },
      <EventTarget>this.elementHost
    );
    super.connectedCallback();
    this.mount();
  }

  render() {
    const textNode = document.createTextNode(JSON.stringify(this.props));
    this.shadow.firstChild?.remove();
    this.shadow.appendChild(textNode);
  }

  mount() {
    this.render();
    this.setAttribute(Attributes.Value, this.initialValue);
    this.clean();
  }
}

export default PropsComponent;
