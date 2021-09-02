import { createApp } from 'vue'
import App from './App.vue'
import Store from './store'
import ElementPlus from 'element-plus';
import './theme/element-variables.scss';
import 'bootstrap/dist/css/bootstrap.min.css'
import router from "./router/index"
import "./assets/css/reset.css"
// 拖拽
// import {drag} from  "./directive/dialogDrag/dialogDrag"

const app = createApp(App)

// app.directive('drag', drag)
app.use(ElementPlus, { size: 'small', zIndex: 3000 });
app.use(Store).use(router).mount('#app')