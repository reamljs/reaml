import BaseElement from "@classes/BaseElement";
import { Attributes } from "@utils/const";
import { getGlobalStatesDefault } from "@utils/state";

class DefineComponent extends BaseElement {
  content: string;
  defaultProps: Map<string, any> | undefined = new Map();
  props: Map<string, any> | undefined = new Map();

  constructor(statesName: string, html: string, attrs: NamedNodeMap) {
    super(statesName);
    this.defaultProps = this.getProps(attrs);
    this.props = this.getProps(this.attributes);
    this.content = html;
  }

  connectedCallback() {
    this.applyProps();
    this.addStatesObserver(() => {
      this.updateProps();
    });
    super.connectedCallback();
    this.mount(this.content);
  }

  applyProps() {
    this.cleanUglyProps();
    this.updateProps();
  }

  updateProps() {
    if (!this.props) return;
    this.props.forEach((value, key) => {
      const nextValue = `${getGlobalStatesDefault(
        this.statesName,
        this.defaultProps?.get(key) ?? value
      )}`;
      const prevValue = this.dataset[key];

      if (nextValue !== prevValue) {
        this.dataset[key] = nextValue;
      }
    });
  }

  cleanUglyProps() {
    for (const attr of Array.from(this.attributes)) {
      this.removeAttribute(attr.nodeName);
    }
  }

  getProps(attributes: NamedNodeMap) {
    const camelRegx = /[^a-zA-Z0-9]+(.)/g;
    const props = new Map<string, any>();
    const replaceCallback = (_: any, chr: string) => chr.toUpperCase();
    for (const attr of Array.from(attributes)) {
      if (attr.nodeName === Attributes.Component) return;
      if (attr.nodeName.includes(Attributes.PropsPrefix)) {
        const [, propName] = attr.nodeName.split(":");
        const camelcase = propName
          .toLowerCase()
          .replace(camelRegx, replaceCallback);
        props.set(camelcase, attr.nodeValue);
      }
    }
    return props;
  }
}

export default DefineComponent;
