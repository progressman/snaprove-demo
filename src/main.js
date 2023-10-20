import Vue from 'vue'
import App from './App.vue'
import store from './store'
import i18n from './i18n'
import { ValidationProvider, ValidationObserver, setInteractionMode, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import * as Sentry from "@sentry/vue";


// Override the default message.
extend('requiredRadio', {
  ...required,
  message: (_, values) => i18n.t('validation.requiredRadio', values)
});

extend('requiredInput', {
  ...required,
  message: (_, values) => i18n.t('validation.requiredInput', values)
});
extend('caseid', {
  validate: value => {
    return value.match(/^[a-zA-Z]\d{9}$/);
  },
  message: (_, values) => i18n.t('CustomerInformation.error.caseId', values)
});


Vue.config.productionTip = false

Sentry.init({
  disabled: true,
  Vue,
  dsn: "https://37eddfe2f0144c13943182916d690f3d@o1060010.ingest.sentry.io/6049116"
});

new Vue({
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
setInteractionMode('eager');