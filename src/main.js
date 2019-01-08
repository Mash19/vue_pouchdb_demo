import Vue from 'vue';
import App from './App.vue';
import store from './store';
import './registerServiceWorker';
import VueMDCAdapter from 'vue-mdc-adapter';
import router from './router';
import VuePouchDB from 'vue-pouch-db';
// VuePouchDB Instance
Vue.use(VuePouchDB);
Vue.use(VueMDCAdapter);

Vue.config.productionTip = false;
// eslint-disable-next-line no-undef
window.db = new PouchDB('test');
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');
