import { createApp } from 'vue'
import './views/common.css'
import './views/login.css'
import './views/list.css'
import './views/moreList.css'
import 'ant-design-vue/dist/reset.css';
import antdv from 'ant-design-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router/routers'
import App from './App.vue'


createApp(App).use(antdv).use(router).use(ElementPlus).mount('#app')//mount将组件APP挂到标签为app的div中