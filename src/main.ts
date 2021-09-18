import { createElement } from "@utils/node";
import { ElementTag } from "@utils/const";
import { createREAMLObject, createObserverFn } from "@utils/reaml";
import WebApp from "@classes/WebApp";

createREAMLObject();
createObserverFn();
createElement(ElementTag.Main, WebApp);
