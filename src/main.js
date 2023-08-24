import Vue from 'vue'
import App from './App.vue'
import router from './router';
import './plugins/element.js'
import moment from "moment"
import "@/icons/index.js"


Vue.prototype.$moment = moment;
Vue.config.productionTip = false



new Vue({
	router,
  render: h => h(App),//指定渲染目标
}).$mount('#app')//绑定元素
