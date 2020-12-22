import Vue from 'vue'
import Root from './Root.vue'
// import App from './App.vue'
import './plugins/element.js'
import store from './store'
import router from "./router"

import './style/theme/index.css'
// import VueLazyload from 'vue-lazyload'
import elTableInfiniteScroll from 'el-table-infinite-scroll';
import ECharts from 'vue-echarts'

Vue.config.productionTip = false
Vue.component('v-chart', ECharts)

// Vue.use(VueLazyload, { lazyComponent: true })
Vue.use(elTableInfiniteScroll);

new Vue({
  router,
  store,
  render: h => h(Root),
}).$mount('#app')

