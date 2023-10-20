import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default new VueI18n({
  locale: 'en', // set locale
  messages: {
    en: require('@/locales/en.json'),
    fr: require('@/locales/fr.json')
    // ru: require('@/locales/ru.json')
  }
})
