export enum Attributes {
  Component = "component",
  OnUpdates = "onupdates",
  OnMounted = "onmount",
  PropsPrefix = "props:",
  States = "states",
  Value = "value",
  Id = "id",
}

export enum EventTypes {
  StatesUpdate = "states",
  PropsUpdate = "props",
}

export enum CustomElement {
  Main = "web-app",
  StatesComponent = "states",
  PropsComponent = "props",
  DefineComponent = "define",
  ImportComponent = "import",
  IfLogicComponent = "if",
  ForLogicComponent = "for",
  LoopComponent = "loop",
  MatchLogicComponent = "match",
}
