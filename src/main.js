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
// // Bucket - Vue Pouch DB Config Object
// // This is a general and fast overview
// // How to define bucket initially in the instance
// const bucket = new VuePouchDB.Bucket({
//   // Main config Object. This is the top level
//   // config object. Where global config
//   // are shared with each database.
//   config: {
//     // Remote Server
//     remote: 'http://127.0.0.1:3000',

//     // Is DB Remote Only?, default: false
//     remoteOnly: false,

//     // db.allDocs({options})
//     allDocs: {
//       include_docs: true
//     },

//     // new Pouch({options})
//     options: {
//       ajax: {
//         cache: true
//       }
//     },

//     // Pouch.sync({option}) for every Instance
//     sync: {
//       since: 0,
//       live: true,
//       retry: true
//     },

//     // db.changes({option})
//     changes: {
//       since: 'now',
//       live: true,
//       include_docs: true
//     },

//     // Global onChange events
//     // for each database.
//     // The functions here are passed to each DB
//     // db.changes().on(() => {})
//     onChanges(change) {
//       console.log('Change: ', change);
//     },
//     onPaused(error) {
//       console.log('Paused', error);
//     },
//     onActive() {
//       console.log('Active');
//     },
//     onDenied(error) {
//       console.log('Denied', error);
//     },
//     onComplete() {
//       console.log('Completed');
//     },
//     onError(error) {
//       console.log('Error', error);
//     },
//     cancel(cancel) {
//       // 'cancel' var is a function to be called
//       // when something bad happens. It will
//       // Cancel the watch event on CouchDB
//     }
//   },

//   // List of PouchDB plugins
//   plugins: [require('pouchdb-find')],

//   // Actions are shared across the
//   // bucket instance.
//   // Think of them as helper methods to bundle
//   // several sets of commands into a single method.
//   // Can be accessed through this.$bucket.[method name]
//   // actions: {
//   //   addDoc(arg) {
//   //     // this is $bucket instance
//   //     this.db('projects').({
//   //       _id: 'document_id'
//   //       data: {}
//   //     }, function () {});
//   //   }
//   // }

//   // Databases
//   // You can define / instanciate
//   // a per database config file.
//   // this will put the database into the internal
//   // state and also, you can define custom "options"
//   // for the database Instance (on: new PouchDB(options))
//   _users: {
//     // Is remote only ?
//     // The _users database lives only
//     // in the server, so its only remote
//     remoteOnly: true
//   },
//   test: {},
//   // 'projects' key -> Database Name, ex: couchdb.com/projects
//   projects: {
//     // PouchDB.sync Options
//     sync: {
//       push: {
//         // config for push
//       },
//       pull: {
//         filter: 'projects/by_user',
//         query_params: { 'name': 'sadi' }
//       }
//     }
//   }
// });
// eslint-disable-next-line no-undef
window.db = new PouchDB('test');
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');
