import { createI18n } from 'vue-i18n'

import en from './en'
import km from './km'
import cz from './cz'

const messages = { en, km, cz }

export default createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  legacy: false,
  messages,
})
