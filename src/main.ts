import { createElement } from "@utils/node";
import { CustomElement } from "@utils/const";
import { global } from "@utils/helpers";
import {
  createREAMLObject,
  getREAMLObject,
  GlobalFunction,
} from "@utils/reaml";
import WebApp from "@classes/WebApp";

createREAMLObject();
global(
  GlobalFunction.createObserver,
  (fn: (states: any, props: any) => void) => {
    console.log(this);
    if (!fn) return;
    const reaml = getREAMLObject();
    if (!reaml.fnIterator) return;
    if (reaml.fx[reaml.fnIterator]) return;
    reaml.fx[reaml.fnIterator] = fn;
  }
);
createElement(CustomElement.Main, WebApp);
