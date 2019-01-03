import Vue from 'vue';
import App from './App.vue';
import store from './store';
import './registerServiceWorker';
import VueMDCAdapter from 'vue-mdc-adapter';
import router from './router';

Vue.use(VueMDCAdapter);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');
