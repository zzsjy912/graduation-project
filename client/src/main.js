import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import '../src/css/main.css'


import ElementUI from 'element-ui';

import moment from 'moment'

Vue.filter('time', function (value, formatString) {
  formatString = formatString || 'YYYY-MM-DD HH:mm';
  return moment(value).format(formatString);
})

// import {
//   Button, Select, Input, InputNumber, Card, Message, Loading
// } from 'element-ui';
// Vue.use(Button);
// Vue.use(Select);
// Vue.use(Input);
// Vue.use(InputNumber);
// Vue.use(Card);
// Vue.use(Message);
// Vue.use(Loading);
// Vue.prototype.$message = Message;
import 'element-ui/lib/theme-chalk/index.css';

import { Skeleton, Comment } from 'ant-design-vue';
import antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css'

// Vue.component(Skeleton.name, Skeleton);
// Vue.component(Comment.name, Comment);

Vue.use(antd);
Vue.use(ElementUI);

Vue.config.productionTip = false




new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
