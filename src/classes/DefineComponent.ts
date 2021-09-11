import BaseElement from "@classes/BaseElement";
import { Attributes, EventTypes, CustomElement } from "@utils/const";
import {
  createArray,
  toPrimitiveObject,
  parseValue,
  randomId,
} from "@utils/data";
import {
  getAttrList,
  getNodeName,
  getNodeValue,
  createTag,
  copyAttrs,
  getHTML,
  setHTML,
} from "@utils/node";
import {
  getGlobalStatesDefault,
  createObserver,
  getSafeStates,
} from "@utils/state";
import { callCode } from "@utils/fn";
import PropsComponent from "@classes/PropsComponent";

const camelRegx = /[^a-zA-Z0-9]+(.)/g;

type DefineComponentInitialValue = {
  statesName: string;
  content: string;
  tagAttributes: NamedNodeMap;
};

export interface IDefineComponent {
  props: any;
  defaultProps: any;
  proxyProps: any;
}

class DefineComponent extends BaseElement implements IDefineComponent {
  content: string;
  defaultProps: any;
  props: any;
  proxyProps: any;
  cachedStates: any;

  constructor({
    statesName,
    content,
    tagAttributes,
  }: DefineComponentInitialValue) {
    super(statesName);
    this.defaultProps = this.getProps(tagAttributes);
    this.props = this.getProps(getAttrList(this));
    this.proxyProps = this.getProps(getAttrList(this));
    this.cachedStates = (<any>window)[statesName];
    this.content = content;
  }

  connectedCallback() {
    this.initComponent();
    this.mount(this.content);
    this.registerPropsComponents();
  }

  invokeUpdate() {
    try {
      requestAnimationFrame(() => {
        const states = toPrimitiveObject(this.cachedStates);
        const props = toPrimitiveObject(this.proxyProps);
        callCode(this, ["$1", "$2", `onupdates($1, $2)`])(states, props);
      });
    } catch {}
  }

  createObservableProps() {
    this.proxyProps = createObserver({}, () => {
      this.dispatchEvent(event);
      this.invokeUpdate();
    });
    const event = new CustomEvent(EventTypes.PropsUpdate, {
      detail: this.proxyProps,
      bubbles: true,
    });
  }

  initComponent() {
    this.addVarsObserver(EventTypes.StatesUpdate, (states) => {
      this.cachedStates = states;
      this.updateProps();
      this.invokeUpdate();
    });
    this.createObservableProps();
    this.cleanUglyProps();
    this.updateProps();
  }

  updateProps() {
    const props = Object.assign(
      Object.assign({}, this.defaultProps ?? {}),
      this.props ?? {}
    );

    Object.keys(props).forEach((attrName) => {
      const path = props[attrName];
      const value = this.cachedStates
        ? getSafeStates(this.statesName, this.cachedStates, path)
        : getGlobalStatesDefault(this.statesName, path);
      const nextValue = (value ?? path).toString();

      const prevValue = this.dataset[attrName];
      if (nextValue !== prevValue) {
        this.proxyProps[attrName] = parseValue(nextValue);
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

    return toPrimitiveObject(props);
  }

  registerPropsComponents() {
    const propsId = randomId();
    const elements: [
      srcElement: Element,
      value: string,
      attrs: NamedNodeMap
    ][] = [];
    const elementSelector = CustomElement.PropsComponent;
    const elementTag = `${CustomElement.PropsComponent}-${propsId}`;
    this.createDeepElement({
      isRemoveNode: false,
      elementSelector,
      elementClass: PropsComponent,
      iteratorCallback: (element) => {
        elements.push([element, getHTML(element), getAttrList(element)]);
        return {
          elementTag,
          elementHost: this,
        };
      },
    });

    elements.forEach(([element, initialValue, attrs]) => {
      const propsElement = createTag(elementTag);
      copyAttrs(attrs, propsElement);
      setHTML(propsElement, initialValue);
      element.parentNode?.replaceChild(propsElement, element);
      element.remove();
    });
  }
}

export default DefineComponent;
