import BaseElement from "@classes/BaseElement";
import { EventTypes, Attributes } from "@utils/const";
import { getSafeStates, getSafeGlobalStates } from "@utils/state";
import { parseValue, createArray } from "@utils/data";
import { callCode } from "@utils/helpers";
import {
  setHTML,
  getHTML,
  getAttr,
  createTag,
  getAttrList,
  getNodeName,
  getNodeValue,
} from "@utils/node";

enum LogicOperator {
  Equal = "eq",
  NotEqual = "not",
  GreaterThan = "gt",
  GreaterThanOrEqual = "gte",
  LessThan = "lt",
  LessThanOrEqual = "lte",
  FreeCondition = "cond",
}

const STYLE_RENDERER_ID = "renderer";

class IfLogicComponent extends BaseElement {
  attrValue: string = "";
  attrVars: any = {};
  cond: any = "";
  op: LogicOperator = LogicOperator.Equal;
  content: string;

  constructor(statesName: string) {
    super(statesName);
    this.content = getHTML(this);
  }

  connectedCallback() {
    this.initLogic();
    this.addObservers();
    this.mount();
  }

  addObservers() {
    this.addVarsObserver(EventTypes.StatesUpdate, (states) =>
      this.renderLogic(states)
    );
    this.addVarsObserver(
      EventTypes.PropsUpdate,
      (props) => this.renderLogic(null, props),
      this.getHost()
    );
  }

  mount() {
    super.mount(this.content);
    this.addStylesheet();
    this.renderLogic();
  }

  logicLexer(expression: string, args: string[] = []) {
    const variables = expression.match(/\$\w+/g);
    if (!variables) return () => false;

    const length = variables?.length ?? 0;
    let index = 0;

    while (index < length) {
      const variable = variables[index++];
      if (args.indexOf(variable) < 0) args.push(variable);
    }

    return callCode(null, [...args, `return ${expression}`]);
  }

  initLogic() {
    this.attrValue = getAttr(this, Attributes.Value);
    [
      LogicOperator.Equal,
      LogicOperator.NotEqual,
      LogicOperator.GreaterThan,
      LogicOperator.GreaterThanOrEqual,
      LogicOperator.LessThan,
      LogicOperator.LessThanOrEqual,
      LogicOperator.FreeCondition,
    ].forEach((op) => {
      const value = getAttr(this, op);
      if (!Boolean(value)) {
        return;
      }

      switch (op) {
        case LogicOperator.FreeCondition:
          const attrs = createArray<Attr>(getAttrList(this));
          for (const attr of attrs) {
            const nodeName = getNodeName(attr);
            if (nodeName === LogicOperator.FreeCondition) continue;

            const nodeValue = getNodeValue(attr);
            if (Boolean(nodeValue)) {
              this.attrVars[getNodeName(attr)] = getNodeValue(attr);
            }
          }

          this.op = op;
          this.cond = value;
          break;

        default:
          this.op = op;
          this.cond = value;
          break;
      }
    });
  }

  isRender(states?: any, _: any = {}) {
    const getStates = (path: string) =>
      states
        ? getSafeStates(this.statesName, states, path)
        : getSafeGlobalStates(this.statesName, path);

    if (this.op === LogicOperator.FreeCondition) {
      const keys = Object.keys(this.attrVars);
      const args = keys.map((key) => `$${key}`);
      const values = keys.map((key) => getStates(this.attrVars[key]));
      const condition = this.logicLexer(this.cond, args);
      return condition(...values);
    }

    let isRender = false;
    const value = getStates(this.attrValue);
    const comparator = parseValue(this.cond);
    const varA = "$1";
    const varB = "$2";

    (<[LogicOperator, Function][]>[
      [LogicOperator.Equal, this.logicLexer(`${varA}===${varB}`)],
      [LogicOperator.NotEqual, this.logicLexer(`${varA}!==${varB}`)],
      [LogicOperator.LessThan, this.logicLexer(`${varA}<${varB}`)],
      [LogicOperator.LessThanOrEqual, this.logicLexer(`${varA}<=${varB}`)],
      [LogicOperator.GreaterThan, this.logicLexer(`${varA}>${varB}`)],
      [LogicOperator.GreaterThanOrEqual, this.logicLexer(`${varA}>=${varB}`)],
    ]).forEach(([op, condition]) => {
      if (this.op !== op) return;
      isRender = condition(value, comparator);
    });

    return isRender;
  }

  renderLogic(states?: any, props?: any) {
    if (!this.isRender(states, props)) {
      this.hideContent();
      return;
    }

    this.showContent();
  }

  getStyletag() {
    return this.shadow.getElementById(STYLE_RENDERER_ID);
  }

  overridesStyles(content: string = "") {
    const style = this.getStyletag();
    if (style) setHTML(style, content);
  }

  showContent() {
    this.overridesStyles();
  }

  hideContent() {
    this.overridesStyles(":host{display:none}");
  }

  addStylesheet() {
    const style = createTag("style");
    style.id = STYLE_RENDERER_ID;
    this.shadow.insertBefore(style, this.shadow.firstChild);
    this.hideContent();
  }
}

export default IfLogicComponent;
