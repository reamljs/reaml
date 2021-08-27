import BaseElement from "@classes/BaseElement";

class LoopComponent extends BaseElement {
  host: Element | null;
  values: any[];

  constructor(values = []) {
    super();
    this.host = this.shadow.host.parentElement;
    if (!this.host) {
      throw new Error(`Loop doesn't have host element.`);
    }
    this.values = values;
    this.render();
  }

  render() {
    const hostAttr = Array.from(this.host?.attributes ?? [])
      .map(({ nodeName: key, nodeValue: value }) => `${key}="${value}"`)
      .join(" ");
    const hostTag = this.host?.nodeName.toLowerCase();
    const openTag = [hostTag, hostAttr].join(" ");
    const content = Array.from({ length: this.values.length })
      .map((item) => this.innerHTML)
      .join(" ");
    this.innerHTML = `<${openTag}>${content}</${hostTag}>`;
    this.host?.replaceWith(this);
    super.render();
  }
}

export default LoopComponent;
