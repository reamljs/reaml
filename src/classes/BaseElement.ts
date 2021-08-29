import { EventTypes } from "@utils/const";

type StatesObserverCallback = () => void;

class BaseElement extends HTMLElement {
  shadow: ShadowRoot;
  oberverCallbacks: StatesObserverCallback[] = [];

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "closed" });
  }

  connectedCallback() {
    this.connectStatesObserver();
  }

  mount(customHTML?: string) {
    this.render(customHTML);
    this.clean();
  }

  render(customHTML?: string) {
    this.shadow.innerHTML = customHTML || this.innerHTML;
  }

  cleanShadow() {
    this.shadow.innerHTML = "";
  }

  clean() {
    requestAnimationFrame(() => {
      this.innerHTML = "";
    });
  }

  addStatesObserver(fn: StatesObserverCallback) {
    this.oberverCallbacks.push(fn);
  }

  connectStatesObserver() {
    document.addEventListener(EventTypes.StatesUpdate, () => {
      for (const fn of this.oberverCallbacks) {
        fn();
      }
    });
  }

  getHost() {
    return (<Node & { host: Node }>this.getRootNode()).host;
  }
}

export default BaseElement;
