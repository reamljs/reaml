// import { findTextNode, isStateNode } from "@utils/node";
// import { initState, updateVars } from "@utils/state";

// type TextNodes = Map<
//   ChildNode,
//   {
//     origin: string | null;
//   }
// >;

// type TraversalCallback = (shadow: ShadowRoot) => void;

// type UpdaterCallback = (
//   text: string | null,
//   vars: any,
//   regx?: RegExp
// ) => string;

// class BaseElement extends HTMLElement {
//   traversalCallbacks: TraversalCallback[] = [];
//   updaterCallbacks: UpdaterCallback[] = [];
//   states: any = (<any>window).states || {};
//   shadow: ShadowRoot;
//   textNodes: TextNodes = new Map();

//   constructor() {
//     super();
//     this.shadow = this.attachShadow({ mode: "closed" });
//     initState(this.states, () => this.retryRender());
//   }

//   addTraversalCallback(fn: TraversalCallback) {
//     this.traversalCallbacks.push(fn);
//   }

//   addUpdaterCallback(fn: UpdaterCallback) {
//     this.updaterCallbacks.push(fn);
//   }

//   cleanDOM(isShadowRoot: boolean = false) {
//     this.textNodes.clear();

//     if (isShadowRoot) {
//       Array.from(this.shadow.childNodes).forEach((node) => {
//         node.parentNode?.removeChild(node);
//       });
//       this.shadow.innerHTML = "";
//     } else {
//       this.innerHTML = "";
//     }
//   }

//   setHTML(html: string | undefined = "") {
//     this.shadow.innerHTML = html;
//   }

//   findTextNodes(self: ShadowRoot | DocumentFragment | Element = this.shadow) {
//     const textNodes: ChildNode[] = findTextNode(self.childNodes);
//     self.querySelectorAll("*").forEach((node) => {
//       findTextNode(node.childNodes).forEach((node) => {
//         textNodes.push(node);
//       });
//     });
//     return textNodes;
//   }

//   updateContent(value: string | null, vars: any, regx?: RegExp) {
//     this.updaterCallbacks.forEach((updateFn) => {
//       value = updateFn(value, vars, regx);
//     });
//     return updateVars(value, vars, regx);
//   }

//   renderTextNodes() {
//     this.findTextNodes()
//       .filter(
//         (node) =>
//           node.textContent && isStateNode(node.textContent) && node.isConnected
//       )
//       .forEach((node) => {
//         const { textContent: origin } = node;
//         this.textNodes.set(node, { origin });
//         node.nodeValue = this.updateContent(origin, this.states);
//       });
//   }

//   render(customHTML?: string) {
//     const dangeriousHTML = Object.freeze({
//       __html: customHTML || this.innerHTML,
//     });
//     this.cleanDOM();
//     this.setHTML(dangeriousHTML.__html);
//     this.traversalCallbacks.forEach((fn) => {
//       fn(this.shadow);
//     });
//     this.renderTextNodes();
//   }

//   retryRender() {
//     this.findTextNodes()
//       .filter((node) => this.textNodes.get(node))
//       .forEach((node) => {
//         if (!node.parentNode?.isConnected) return;

//         const textContent = this.textNodes.get(node)?.origin ?? null;
//         const nextValue = this.updateContent(textContent, this.states);
//         if (node.nodeValue === nextValue) return;

//         node.nodeValue = nextValue;
//       });
//   }
// }

// export default BaseElement;
