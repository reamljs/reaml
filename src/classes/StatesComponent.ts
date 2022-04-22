import { Attributes } from "@utils/const";
import { global, renderValueAs } from "@utils/helpers";
import {
  attachShadow,
  getAttr,
  getContent,
  renderOnConnected,
  setContent,
} from "@utils/node";
import { getStates } from "@utils/state";
import Reaml, { StateObserverFn } from "@classes/Reaml";

const DOT_NOTATION = ".";

export default () => {
  const shadowRoots = new WeakMap();

  return class extends HTMLElement {
    stateName: string = "";
    statesPath: string = "";
    renderAs: string = "";

    constructor() {
      super();
      shadowRoots.set(this, attachShadow(this));
    }

    connectedCallback() {
      this.init();
      this.mount();
    }

    init() {
      const value = getAttr(this, Attributes.Value);
      const [stateName, ...statesPath] = value.split(DOT_NOTATION);
      this.stateName = stateName;
      this.statesPath = statesPath.join(DOT_NOTATION);
      this.renderAs = getAttr(this, Attributes.RenderAs);
    }

    listenStateObserver() {
      const observer = global<(fn: StateObserverFn) => void>(
        Reaml.getObserverName(this.stateName, true)
      );

      observer?.((_: any, states: any) => this.render(states));
    }

    mount() {
      renderOnConnected(this, () => {
        this.listenStateObserver();
        this.render(global(this.stateName));
      });
    }

    render(states?: any) {
      let nextValue = getStates(states, this.statesPath);
      if (this.renderAs) {
        nextValue = renderValueAs(nextValue, this.renderAs);
      }

      const shadow = shadowRoots.get(this);
      const prevValue = getContent(shadow);
      if (prevValue === nextValue) return;

      setContent(shadow, nextValue);
    }
  };
};
