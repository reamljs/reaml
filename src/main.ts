import Realm from '@classes/Realm'
import registerDefineComponent from "@classes/DefineComponent";
import registerWebApp from "@classes/WebApp";

registerDefineComponent();
registerWebApp()

const realm = new Realm();
realm.init();

if (window) {
  (<any>window).realm = realm;
}

export default realm;
