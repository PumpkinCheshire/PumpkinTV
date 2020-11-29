import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import store from './store'
import './style/theme/index.css'
// import VueLazyload from 'vue-lazyload'
import elTableInfiniteScroll from 'el-table-infinite-scroll';

Vue.config.productionTip = false

// Vue.use(VueLazyload, { lazyComponent: true })
Vue.use(elTableInfiniteScroll);

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')

