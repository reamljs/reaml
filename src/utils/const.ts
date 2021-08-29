export const Regx = {
  vars: /@(states|props)\.?([a-zA-Z_$][a-zA-Z__\.$0-9]+)?/gm,
  state: /@states\.?([a-zA-Z_$][a-zA-Z__\.$0-9]+)?/gm,
  props: /@props\.?([a-zA-Z_$][a-zA-Z__\.$0-9]+)?/gm,
  singleItem: /@item/gm,
  item: /@item\[[0-9]\]\.?([a-zA-Z_$][a-zA-Z__\.$0-9]+)?/gm,
};

export enum Attributes {
  Component = "component",
  PropsPrefix = "props:",
}

export enum EventTypes {
  StatesUpdate = "states-update",
}

export enum CustomElement {
  Main = "web-app",
  StatesComponent = "states",
  DefineComponent = "define",
  ImportComponent = "import",
  IfLogicComponent = "if",
  ForLogicComponent = "for",
  LoopComponent = "loop",
  MatchLogicComponent = "match",
}
