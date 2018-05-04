import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'the-grid-flexbox/css/the-grid.min.css'

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
