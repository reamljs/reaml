// import BaseElement from "@classes/BaseElementLegacy";
// import { updateVars } from "@utils/state";
// import { Regx } from "@utils/const";

// type LoopItemValue = {
//   value: any;
//   index: number;
//   textNodes: ChildNode[];
// };

// class LoopComponent extends BaseElement {
//   host: Element | null;
//   hostProps: {
//     name: string;
//     attrs: NamedNodeMap;
//   };
//   values: any[];
//   content: string;
//   fragments: Map<DocumentFragment, LoopItemValue> = new Map();

//   constructor(values: any[] = []) {
//     super();
//     const { parentElement } = this.shadow.host;
//     if (!parentElement) throw new Error(`Loop doesn't have host element.`);
//     this.content = this.innerHTML;
//     this.host = parentElement;
//     this.hostProps = Object.freeze({
//       name: this.host.nodeName.toLowerCase(),
//       attrs: this.host.attributes,
//     });
//     this.values = values;
//     this.renderLoop();
//   }

//   renderItems(element: string, attributes: NamedNodeMap) {
//     const hostElement = document.createElement(element.toLowerCase());
//     Array.from(attributes).forEach(({ nodeName, nodeValue }) =>
//       hostElement.setAttribute(nodeName, nodeValue || nodeName)
//     );

//     this.values.forEach((value, index) => {
//       const template = document.createElement("template");
//       const content = this.content.replace(
//         Regx.singleItem,
//         (m) => `${m}[${index}]`
//       );
//       template.innerHTML = updateVars(content, value, Regx.item);
//       hostElement.appendChild(template.content);
//     });

//     this.render(hostElement.innerHTML);
//   }

//   renderLoop() {
//     this.cleanDOM();
//     if (!this.host) return;
//     this.host.replaceWith(this);
//     this.renderItems(this.hostProps.name, this.hostProps.attrs);
//   }

//   retryRender() {
//     // this.renderItems(this.hostProps.name, this.hostProps.attrs);
//     super.retryRender();
//     // console.log(this.values);
//   }
// }

// export default LoopComponent;
