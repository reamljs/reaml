import BaseElement from "@classes/BaseElement";
import { getSafeGlobalStates } from "@utils/state";
import { parseValue } from "@utils/data";

enum LogicOperator {
  Equal = "eq",
  NotEqual = "not",
  GreaterThan = "gt",
  GreaterThanOrEqual = "gte",
  LessThan = "lt",
  LessThanOrEqual = "lte",
}

const STYLE_RENDERER_ID = "renderer";

class IfLogicComponent extends BaseElement {
  attrValue: string = "";
  cond: any = "";
  op: LogicOperator = LogicOperator.Equal;
  content: string;

  constructor(statesName: string) {
    super(statesName);
    this.content = this.getHTML();
  }

  connectedCallback() {
    this.initLogic();
    this.addStatesObserver(() => {
      this.renderLogic();
    });
    super.connectedCallback();
    this.mount();
  }

  initLogic() {
    this.attrValue = <string>this.getAttrVal("value");
    [
      LogicOperator.Equal,
      LogicOperator.NotEqual,
      LogicOperator.GreaterThan,
      LogicOperator.GreaterThanOrEqual,
      LogicOperator.LessThan,
      LogicOperator.LessThanOrEqual,
    ].forEach((op) => {
      const value = <string>this.getAttrVal(op);
      if (value !== null) {
        this.op = op;
        this.cond = value;
      }
    });
  }

  renderLogic() {
    const value = getSafeGlobalStates(this.statesName, this.attrValue);
    const comparator = parseValue(this.cond);
    const isRender = [
      [LogicOperator.Equal, value === comparator],
      [LogicOperator.NotEqual, value !== comparator],
      [LogicOperator.LessThan, value < comparator],
      [LogicOperator.LessThanOrEqual, value <= comparator],
      [LogicOperator.GreaterThan, value > comparator],
      [LogicOperator.GreaterThanOrEqual, value >= comparator],
    ]
      .map(([op, isValid]) => this.op === op && isValid)
      .some((isTrue) => isTrue);

    if (isRender) {
      this.showContent();
    } else {
      this.hideContent();
    }
  }

  getStyletag() {
    return this.shadow.getElementById(STYLE_RENDERER_ID);
  }

  overridesStyles(content: string = "") {
    const style = this.getStyletag();
    if (style) this.setHTML(content, style);
  }

  showContent() {
    this.overridesStyles();
  }

  hideContent() {
    this.overridesStyles(":host{display:none}");
  }

  addStylesheet() {
    const style = document.createElement("style");
    style.id = STYLE_RENDERER_ID;
    this.shadow.insertBefore(style, this.shadow.firstChild);
    this.hideContent();
  }

  mount() {
    this.render(this.content);
    this.addStylesheet();
    this.renderLogic();
    this.clean();
  }
}

export default IfLogicComponent;
