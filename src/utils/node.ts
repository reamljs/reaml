import { Regx } from "@utils/const";

export const findTextNode = (nodes: NodeListOf<ChildNode>) =>
  Array.from(nodes).filter((el) => el.nodeType === Node.TEXT_NODE);

export const isStateNode = (value?: string | undefined | null) =>
  value && value.match(Regx.vars);

export const createElement = (
  name: string,
  elementClass: CustomElementConstructor
) => {
  customElements.define(name, elementClass);
};

export const createScopedElement = ({
  shadow,
  tag,
  selector,
  elementClass,
}: {
  shadow: ShadowRoot;
  tag: string;
  selector: string;
  elementClass: CustomElementConstructor;
}) => {
  shadow.querySelectorAll(selector).forEach((node) => {
    const element = document.createElement(tag);
    Array.from(node.attributes).forEach((attr) =>
      element.setAttribute(
        attr.nodeName,
        attr.nodeValue ? attr.nodeValue : attr.nodeName
      )
    );
    element.innerHTML = node.innerHTML;
    node.parentNode?.replaceChild(element, node);
    node.parentNode?.removeChild(node);
  });
  createElement(tag, elementClass);
};
