import { createElement } from "@utils/node";
import { ElementTag } from "@utils/const";
import { createREAMLObject, createObserverFn, createRefFn } from "@utils/reaml";
import { global } from "@utils/helpers";
import WebApp from "@classes/WebApp";

createREAMLObject();
global(createRefFn(), () => null);
createObserverFn();
createElement(ElementTag.Main, WebApp);
