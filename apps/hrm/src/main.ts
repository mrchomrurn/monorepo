import { createApp } from 'vue'
import { MutationCache, QueryCache, VueQueryPlugin } from '@tanstack/vue-query'
import './style.css'
import { createPinia } from 'pinia'
import { configure } from 'vee-validate'
import { isAxiosError } from 'axios'
import App from './App.vue'
import router from './router'
import { useNotification } from './composables/useNotification'
import i18n from '@/locales'

const pinia = createPinia()
const app = createApp(App)
const { onAxiosError } = useNotification()

const queryCache = new QueryCache({ onError: err => isAxiosError(err) && onAxiosError(err) })
const mutationCache = new MutationCache({ onError: err => isAxiosError(err) && onAxiosError(err) })

configure({
  validateOnBlur: false,
})

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(VueQueryPlugin, {
  queryClientConfig: {
    queryCache,
    mutationCache,
    defaultOptions: {
      queries: { retry: false },
    },
  },
})

app.mount('#app')
