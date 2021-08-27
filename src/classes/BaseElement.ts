import { findTextNode, isStateNode } from "@utils/node";
import { initState, updateNodeValueState } from "@utils/state";

type TextNodes = Map<
  ChildNode,
  {
    origin: string | null;
  }
>;

type TraversalCallback = (shadow: ShadowRoot) => void;

class BaseElement extends HTMLElement {
  traversalCallbacks: TraversalCallback[] = [];
  states: any = (<any>window).states || {};
  shadow: ShadowRoot;
  textNodes: TextNodes = new Map();
  rawHTML: string;

  constructor(html = "") {
    super();
    this.rawHTML = html;
    this.shadow = this.attachShadow({ mode: "closed" });
    initState(this.states, () => this.retryRender());
  }

  addTraversalCallback(fn: TraversalCallback) {
    this.traversalCallbacks.push(fn);
  }

  cleanDOM(isShadowRoot: boolean = false) {
    this.textNodes.clear();

    if (isShadowRoot) {
      Array.from(this.shadow.children).forEach((node) => {
        node.parentNode?.removeChild(node);
      });
      this.shadow.innerHTML = "";
    } else {
      this.innerHTML = "";
    }
  }

  setHTML(html: string) {
    this.shadow.innerHTML = html;
  }

  findTextNodes() {
    const textNodes: ChildNode[] = findTextNode(this.shadow.childNodes);
    this.shadow.querySelectorAll("*").forEach((el) => {
      findTextNode(el.childNodes).forEach((node) => {
        textNodes.push(node);
      });
    });
    return textNodes;
  }

  render() {
    const dangeriousHTML = Object.freeze({
      __html: this.rawHTML !== "" ? this.rawHTML : this.innerHTML,
    });
    this.cleanDOM();
    this.setHTML(dangeriousHTML.__html);

    this.traversalCallbacks.forEach((fn) => {
      fn(this.shadow);
    });

    this.findTextNodes()
      .filter(
        (node) =>
          node.textContent && isStateNode(node.textContent) && node.isConnected
      )
      .forEach((node) => {
        const { textContent: origin } = node;
        this.textNodes.set(node, { origin });
        node.nodeValue = updateNodeValueState(origin, this.states);
      });
  }

  retryRender() {
    this.findTextNodes()
      .filter((node) => this.textNodes.get(node))
      .forEach((node) => {
        if (!node.parentNode?.isConnected) return;

        const textContent = this.textNodes.get(node)?.origin ?? null;
        const nextValue = updateNodeValueState(textContent, this.states);
        if (node.nodeValue === nextValue) return;

        node.nodeValue = nextValue;
      });
  }
}

export default BaseElement;
