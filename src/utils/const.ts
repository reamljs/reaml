export enum Attributes {
  RenderAs = "as",
  Component = "component",
  States = "states",
  Value = "value",
  Id = "id",
  Module = "module",
  Src = "src",
}

export enum EventTypes {
  StatesUpdate = "states",
  PropsUpdate = "props",
}

export enum ElementTag {
  Main = "web-app",
  StatesComponent = "states",
  PropsComponent = "props",
  DefineComponent = "define",
  ImportComponent = "import",
  IfLogicComponent = "if",
  ForLogicComponent = "for",
  LoopComponent = "loop",
  MatchLogicComponent = "match",
  Script = "script",
}
