import isNil from "lodash/isNil";

import BaseElement from "@classes/BaseElement";
import { getSafeStates } from "@utils/state";
import { parseValue } from "@utils/data";

enum LogicOperator {
  Equal = "eq",
  NotEqual = "not",
  GreaterThan = "gt",
  GreaterThanOrEqual = "gte",
  LessThan = "lt",
  LessThanOrEqual = "lte",
}

class IfLogicComponent extends BaseElement {
  value: string = "";
  cond: any = "";
  op: LogicOperator = LogicOperator.Equal;
  content: string;

  constructor() {
    super();
    this.content = this.innerHTML;
    this.parseLogicOperator();
    this.renderLogic();
  }

  retryRender() {
    super.retryRender();
    this.renderLogic();
  }

  parseLogicOperator() {
    const attr = {
      value: <string>this.getAttribute("value"),
      [LogicOperator.Equal]: <string>this.getAttribute(LogicOperator.Equal),
      [LogicOperator.NotEqual]: <string>(
        this.getAttribute(LogicOperator.NotEqual)
      ),
      [LogicOperator.GreaterThan]: <string>(
        this.getAttribute(LogicOperator.GreaterThan)
      ),
      [LogicOperator.GreaterThanOrEqual]: <string>(
        this.getAttribute(LogicOperator.GreaterThanOrEqual)
      ),
      [LogicOperator.LessThan]: <string>(
        this.getAttribute(LogicOperator.LessThan)
      ),
      [LogicOperator.LessThanOrEqual]: <string>(
        this.getAttribute(LogicOperator.LessThanOrEqual)
      ),
    };

    if (!isNil(attr.eq)) this.op = LogicOperator.Equal;
    if (!isNil(attr.not)) this.op = LogicOperator.NotEqual;
    if (!isNil(attr.gt)) this.op = LogicOperator.GreaterThan;
    if (!isNil(attr.gte)) this.op = LogicOperator.GreaterThanOrEqual;
    if (!isNil(attr.lt)) this.op = LogicOperator.LessThan;
    if (!isNil(attr.lte)) this.op = LogicOperator.LessThanOrEqual;

    this.value = attr.value;
    this.cond = attr[this.op];
  }

  renderLogic() {
    const value = getSafeStates(this.states, this.value);
    const comparator = parseValue(this.cond);

    let isRender = false;
    switch (this.op) {
      case LogicOperator.Equal:
        isRender = value === comparator;
        break;

      case LogicOperator.NotEqual:
        isRender = value !== comparator;
        break;

      case LogicOperator.LessThan:
        isRender = value < comparator;
        break;

      case LogicOperator.LessThanOrEqual:
        isRender = value <= comparator;
        break;

      case LogicOperator.GreaterThan:
        isRender = value > comparator;
        break;

      case LogicOperator.GreaterThanOrEqual:
        isRender = value >= comparator;
        break;
    }

    if (isRender) {
      this.render(this.content);
    } else {
      this.cleanDOM(true);
    }
  }
}

export default IfLogicComponent;
