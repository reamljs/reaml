// import { Attributes, ElementTag } from "@utils/const";
// import { createArray, parseValue, randomId } from "@utils/data";
// import { callCode, global } from "@utils/helpers";
// import {
//   attachShadow,
//   cleanHTML,
//   createTag,
//   getAttr,
//   getAttrList,
//   getHTML,
//   getNodeName,
//   getNodeValue,
//   setHTML,
// } from "@utils/node";
// import { getSafeStates, listenStates } from "@utils/state";

// enum LogicOperator {
//   Equal = "eq",
//   NotEqual = "not",
//   GreaterThan = "gt",
//   GreaterThanOrEqual = "gte",
//   LessThan = "lt",
//   LessThanOrEqual = "lte",
//   FreeCondition = "cond",
// }

// type IfLogicComponentOptions = {
//   statesName: string;
// };

// export default ({ statesName }: IfLogicComponentOptions) => {
//   return class extends HTMLElement {
//     attrValue: string = "";
//     attrVars: any = {};
//     cond: any = "";
//     op: LogicOperator = LogicOperator.Equal;
//     id: string;
//     shadow: ShadowRoot;

//     constructor() {
//       super();
//       this.shadow = attachShadow(this);
//       this.id = `${ElementTag.IfLogicComponent}-${randomId()}`;
//     }

//     connectedCallback() {
//       this.listenObserver();
//       this.initLogic();
//       this.mount();
//     }

//     listenObserver() {
//       listenStates(statesName, (data) => {
//         if (!this.isConnected) return;
//         this.render((<any>data)?.detail);
//       });
//     }

//     logicLexer(expression: string, args: string[] = []) {
//       const variables = expression.match(/\$\w+/g);
//       if (!variables) return () => false;

//       const length = variables?.length ?? 0;
//       let index = 0;

//       while (index < length) {
//         const variable = variables[index++];
//         if (args.indexOf(variable) < 0) args.push(variable);
//       }

//       return callCode(null, [...args, `return ${expression}`]);
//     }

//     initLogic() {
//       this.attrValue = getAttr(this, Attributes.Value);
//       [
//         LogicOperator.Equal,
//         LogicOperator.NotEqual,
//         LogicOperator.GreaterThan,
//         LogicOperator.GreaterThanOrEqual,
//         LogicOperator.LessThan,
//         LogicOperator.LessThanOrEqual,
//         LogicOperator.FreeCondition,
//       ].forEach((op) => {
//         const value = getAttr(this, op);
//         if (!Boolean(value)) {
//           return;
//         }

//         switch (op) {
//           case LogicOperator.FreeCondition:
//             const attrs = createArray<Attr>(getAttrList(this));
//             for (const attr of attrs) {
//               const nodeName = getNodeName(attr);
//               if (nodeName === LogicOperator.FreeCondition) continue;

//               const nodeValue = getNodeValue(attr);
//               if (Boolean(nodeValue)) {
//                 this.attrVars[getNodeName(attr)] = getNodeValue(attr);
//               }
//             }

//             this.op = op;
//             this.cond = value;
//             break;

//           default:
//             this.op = op;
//             this.cond = value;
//             break;
//         }
//       });
//     }

//     getStyletag() {
//       return this.shadow.getElementById(this.id);
//     }

//     overridesStyles(content: string = "") {
//       const style = this.getStyletag();
//       if (style) setHTML(style, content);
//     }

//     showContent() {
//       this.overridesStyles();
//     }

//     hideContent() {
//       this.overridesStyles(":host{display:none}");
//     }

//     addStylesheet() {
//       const style = createTag("style");
//       style.id = this.id;
//       this.shadow.insertBefore(style, this.shadow.firstChild);
//       this.hideContent();
//     }

//     mount() {
//       const html = getHTML(this);
//       setHTML(this.shadow, html);
//       this.addStylesheet();
//       this.render(global(statesName));
//       requestAnimationFrame(() => {
//         cleanHTML(this);
//       });
//     }

//     isRender(states?: any, _: any = {}) {
//       const statesValue = (path: string) =>
//         getSafeStates(statesName, states, path);

//       if (this.op === LogicOperator.FreeCondition) {
//         const keys = Object.keys(this.attrVars);
//         const args = keys.map((key) => `$${key}`);
//         const values = keys.map((key) => statesValue(this.attrVars[key]));
//         const condition = this.logicLexer(this.cond, args);
//         return condition(...values);
//       }

//       let isRender = false;
//       const value = statesValue(this.attrValue);
//       const comparator = parseValue(this.cond);
//       const varA = "$1";
//       const varB = "$2";

//       (<[LogicOperator, Function][]>[
//         [LogicOperator.Equal, this.logicLexer(`${varA}===${varB}`)],
//         [LogicOperator.NotEqual, this.logicLexer(`${varA}!==${varB}`)],
//         [LogicOperator.LessThan, this.logicLexer(`${varA}<${varB}`)],
//         [LogicOperator.LessThanOrEqual, this.logicLexer(`${varA}<=${varB}`)],
//         [LogicOperator.GreaterThan, this.logicLexer(`${varA}>${varB}`)],
//         [LogicOperator.GreaterThanOrEqual, this.logicLexer(`${varA}>=${varB}`)],
//       ]).forEach(([op, condition]) => {
//         if (this.op !== op) return;
//         isRender = condition(value, comparator);
//       });

//       return isRender;
//     }

//     render(states?: any, props?: any) {
//       if (!this.isRender(states, props)) {
//         return this.hideContent();
//       }

//       this.showContent();
//     }
//   };
// };
