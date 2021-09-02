import BaseElement from "@classes/BaseElement";
import { Attributes, EventTypes } from "@utils/const";
import { createArray } from "@utils/data";
import { getAttrList, getNodeName, getNodeValue } from "@utils/node";
import {
  getGlobalStatesDefault,
  createObserver,
  getSafeStates,
} from "@utils/state";

const camelRegx = /[^a-zA-Z0-9]+(.)/g;

class DefineComponent extends BaseElement {
  private content: string;
  private defaultProps: any;
  private props: any;
  private $props: any;

  constructor(statesName: string, html: string, attrs: NamedNodeMap) {
    super(statesName);
    this.defaultProps = this.getProps(attrs);
    this.props = this.getProps(getAttrList(this));
    this.$props = this.getProps(getAttrList(this));
    this.content = html;
  }

  connectedCallback() {
    this.applyProps();
    super.connectedCallback();
    this.mount(this.content);
  }

  createObservableProps() {
    this.$props = createObserver({}, () => this.dispatchEvent(event));
    const event = new CustomEvent(EventTypes.PropsUpdate, {
      detail: this.$props,
    });
  }

  applyProps() {
    this.addVarsObserver(EventTypes.StatesUpdate, (states) =>
      this.updateProps(states)
    );
    this.createObservableProps();
    this.cleanUglyProps();
    this.updateProps();
  }

  updateProps(states?: any) {
    if (!this.props) return;
    Object.keys(this.props).forEach((attrName) => {
      const path = this.props[attrName] || this.defaultProps[attrName];
      const nextValue = states
        ? getSafeStates(this.statesName, states, path)
        : getGlobalStatesDefault(this.statesName, path);
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
