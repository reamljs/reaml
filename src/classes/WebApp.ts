export const TagName = "web-app"

const registerComponent = () => {
  customElements.define(
    TagName,
    class extends HTMLElement {
      constructor() {
        super();
      }
    }
  );
};

export default registerComponent;
