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
import { callCode, global } from "@utils/helpers";
import { addREAMLFn } from "@utils/reaml";
import PropsComponent from "@classes/PropsComponent";

const camelRegx = /[^a-zA-Z0-9]+(.)/g;

type DefineComponentInitialValue = {
  statesName: string;
  content: string;
  tagAttributes: NamedNodeMap;
  scripts?: Node[];
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
  isDestroyed: boolean = false;
  scripts: Node[] = [];

  constructor({
    statesName,
    content,
    tagAttributes,
    scripts,
  }: DefineComponentInitialValue) {
    super(statesName);
    if (scripts) this.scripts = scripts;
    this.cachedStates = global(statesName);
    this.parseProps(tagAttributes);
    this.content = content;
  }

  connectedCallback() {
    if (!this.getHost()) return;
    this.createObservableProps();
    this.addObservers();
    this.mount();
    this.registerPropsComponents();
  }

  disconnectedCallback() {
    this.isDestroyed = true;
    super.disconnectedCallback();
  }

  parseProps(attributes: NamedNodeMap) {
    this.defaultProps = this.getProps(attributes);
    this.props = this.getProps(getAttrList(this));
    this.proxyProps = this.getProps(getAttrList(this));
  }

  addObservers() {
    this.addVarsObserver(EventTypes.StatesUpdate, (states) => {
      if (this.isDestroyed) return;
      this.cachedStates = states;
      this.updateProps();
      this.invokeUpdate();
    });
  }

  mount() {
    super.mount(this.content);
    this.cleanUglyProps();
    this.updateProps();
    this.scripts.forEach((script) => {
      this.shadow.appendChild(script);
    });
  }

  invokeUpdate() {
    // try {
    //   requestAnimationFrame(() => {
    //     const states = toPrimitiveObject(this.cachedStates);
    //     const props = toPrimitiveObject(this.proxyProps);
    //     callCode(this, ["$1", "$2", `${this.onUpdates}($1, $2)`])(
    //       states,
    //       props
    //     );
    //   });
    // } catch {}
  }

  createObservableProps() {
    this.proxyProps = createObserver({}, () => {
      if (this.isDestroyed) return;
      this.dispatchEvent(event);
      this.invokeUpdate();
    });
    const event = new CustomEvent(EventTypes.PropsUpdate, {
      detail: this.proxyProps,
      bubbles: true,
    });
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
    const restrictList: string[] = [Attributes.Component];

    for (const attr of createArray<Attr>(attributes)) {
      const attrName = getNodeName(attr);
      if (restrictList.includes(attrName)) continue;
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
