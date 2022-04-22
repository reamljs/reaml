class Realm {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('template').forEach((template) => {
      const webApp = template.content.querySelector('web-app');
      if (!webApp) return;
      template.replaceWith(webApp);
    });
  }
}

export default Realm;
