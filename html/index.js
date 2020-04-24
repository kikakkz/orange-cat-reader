import Vue from 'vue'

import ElementUI from 'element-ui'
Vue.use(ElementUI)

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import App from '../src/App'
import router from '../router/router'
import { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

new Vue({
    el: "#app",
    render: h => h(App),
    router
})