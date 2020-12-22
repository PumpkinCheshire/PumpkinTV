import Vue from 'vue'
import VueRouter from 'vue-router'
import App from "../App.vue"
import Oauth from "../components/Oauth.vue"

Vue.use(VueRouter);


const routes = [
    { path: '/', name: "root", component: App },
    { path: '/oauth', name: "oauth", component: Oauth }
]
const router = new VueRouter({
    mode: 'history',
    routes: routes
});

export default router