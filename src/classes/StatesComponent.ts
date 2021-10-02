import { Attributes } from "@utils/const";
import { global, renderValueAs } from "@utils/helpers";
import { attachShadow, getAttr, getContent, setContent } from "@utils/node";
import { getStates, listenStates } from "@utils/state";

type StatesComponentOptions = {
  statesName: string;
};

export default ({ statesName }: StatesComponentOptions) => {
  return class extends HTMLElement {
    statesPath: string = "";
    renderAs: string = "";
    shadow: ShadowRoot;

    constructor() {
      super();
      this.shadow = attachShadow(this);
    }

    connectedCallback() {
      this.renderAs = getAttr(this, Attributes.RenderAs);
      this.statesPath = getAttr(this, Attributes.Value);
      this.listenObserver();
      this.mount();
    }

    listenObserver() {
      listenStates(statesName, (data) => {
        if (!this.isConnected) return;
        this.render((<any>data)?.detail);
      });
    }

    mount() {
      this.render(global(statesName));
    }

    render(states?: any) {
      let nextValue = getStates(states, this.statesPath);
      if (this.renderAs) {
        nextValue = renderValueAs(nextValue, this.renderAs);
      }

      const prevValue = getContent(this.shadow);
      if (prevValue === nextValue) return;

      setContent(this.shadow, nextValue);
    }
  };
};
