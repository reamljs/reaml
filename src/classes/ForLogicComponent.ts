// import { createScopedElement } from "@utils/node";
// import { CustomElement } from "@utils/const";
// import { getSafeStates } from "@utils/state";
// import BaseElement from "@classes/BaseElementLegacy";
// import LoopComponent from "@classes/LoopComponent";

// class ForLogicComponent extends BaseElement {
//   key: string;
//   values: any[] = [];
//   content: string;

//   constructor() {
//     super();
//     const [, , ...key] = Math.random().toString().split("");
//     this.key = key.join("");
//     this.content = this.innerHTML;
//     this.parseArray();
//     this.registerLoopComponent();
//     this.renderFor();
//   }

//   parseArray() {
//     const each = <string>this.getAttribute("each");
//     this.values = getSafeStates(this.states, each);
//   }

//   registerLoopComponent() {
//     this.addTraversalCallback((shadow: ShadowRoot) => {
//       const values = this.values;
//       createScopedElement({
//         shadow,
//         tag: `${CustomElement.LoopComponent}-${this.key}`,
//         selector: CustomElement.LoopComponent,
//         elementClass: class extends LoopComponent {
//           constructor() {
//             super(values);
//           }
//         },
//       });
//     });
//   }

//   renderFor() {
//     this.render();
//   }
// }

// export default ForLogicComponent;
