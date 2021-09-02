// declare module '*.vue' {
//   import { DefineComponent } from 'vue'
//   const component: DefineComponent<{}, {}, any>
//   export default component
// }

declare module '*.vue' {
    import {defineComponent,FunctionalComponent} from 'vue'
    const component:ReturnType<typeof defineComponent> | FunctionalComponent;
    export default component;
}