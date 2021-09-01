import BaseElement from "@classes/BaseElement";
import { Attributes, EventTypes } from "@utils/const";
import { getAttrList, getNodeName, getNodeValue } from "@utils/node";
import { createArray } from "@utils/data";
import { getGlobalStatesDefault, createObserver } from "@utils/state";

const camelRegx = /[^a-zA-Z0-9]+(.)/g;

class DefineComponent extends BaseElement {
  content: string;
  defaultProps: any;
  props: any;
  $props: any;

  constructor(statesName: string, html: string, attrs: NamedNodeMap) {
    super(statesName);
    this.defaultProps = this.getProps(attrs);
    this.props = this.getProps(getAttrList(this));
    this.$props = {};
    this.content = html;
  }

  connectedCallback() {
    this.applyProps();
    super.connectedCallback();
    this.mount(this.content);
  }

  createObservableProps() {
    const event = new CustomEvent(EventTypes.PropsUpdate);
    this.$props = createObserver(this.props, () => this.dispatchEvent(event));
  }

  applyProps() {
    this.addVarsObserver(EventTypes.StatesUpdate, () => this.updateProps());
    this.createObservableProps();
    this.cleanUglyProps();
    this.updateProps();
  }

  updateProps() {
    if (!this.props) return;
    Object.keys(this.props).forEach((attrName) => {
      const attrValue = this.props[attrName];

      const path = attrValue ?? this.defaultProps?.[attrName];
      const nextValue = getGlobalStatesDefault(this.statesName, path);
      const prevValue = this.dataset[attrName];
      if (nextValue !== prevValue) {
        this.$props[attrName] = nextValue;
        this.dataset[attrName] = `${nextValue}`;
      }
    });
  }

  cleanUglyProps() {
    for (const attr of createArray<Attr>(getAttrList(this))) {
      this.removeAttribute(getNodeName(attr));
    }
  }

  getProps(attributes: NamedNodeMap) {
    const props: any = {};
    const replaceCallback = (_: any, chr: string) => chr.toUpperCase();

    for (const attr of createArray<Attr>(attributes)) {
      const attrName = getNodeName(attr);
      if (attrName === Attributes.Component) continue;
      if (attrName.includes(Attributes.PropsPrefix)) {
        const attrValue = getNodeValue(attr);
        const [, propName] = attrName.split(":");
        const camelcase = propName
          .toLowerCase()
          .replace(camelRegx, replaceCallback);
        props[camelcase] = attrValue;
      }
    }

    return props;
  }
}

export default DefineComponent;
