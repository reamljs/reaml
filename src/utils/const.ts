export enum Attributes {
  Id = "id",
  Src = "src",
  State = "state",
  Value = "value",
  Module = "module",
  AppName = "name",
  RenderAs = "as",
  Component = "component",
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
