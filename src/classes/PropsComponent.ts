import { Attributes, EventTypes } from "@utils/const";
import { getStates } from "@utils/state";
import { getContent } from "@utils/node";
import { renderValueAs } from "@utils/helpers";
import BaseElement from "@classes/BaseElement";
import { IDefineComponent } from "@classes/DefineComponent";

type PropsComponentInitialValue = {
  elementHost: IDefineComponent;
  initialValue: string;
};

class PropsComponent extends BaseElement {
  elementHost: EventTarget | IDefineComponent;
  initialValue: string = "";
  props: any;

  constructor({ elementHost }: PropsComponentInitialValue) {
    super();
    this.elementHost = elementHost;
    this.props = Object.assign(
      Object.assign({}, elementHost?.defaultProps ?? {}),
      elementHost?.proxyProps ?? {}
    );
  }

  connectedCallback() {
    this.initialValue = getContent(this);
    this.addObservsers();
    this.parseRenderer();
    this.mount();
  }

  addObservsers() {
    this.addVarsObserver(
      EventTypes.PropsUpdate,
      (props) => {
        this.props = Object.assign(this.props, props);
        this.render();
      },
      <EventTarget>this.elementHost
    );
  }

  mount() {
    this.render();
    this.setAttribute(Attributes.Value, this.initialValue);
    this.clean();
  }

  render() {
    let value = getStates(this.props, this.initialValue);
    if (value === undefined) return;
    if (this.renderAs) {
      value = renderValueAs(value, this.renderAs);
    }

    const textNode = document.createTextNode(value);
    this.shadow.firstChild?.remove();
    this.shadow.appendChild(textNode);
  }
}

export default PropsComponent;
