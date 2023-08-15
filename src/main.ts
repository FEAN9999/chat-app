import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vuesax from 'vuesax3'
import App from './App.vue'
import router from './router'
import 'vuesax3/dist/vuesax.css'
import 'material-icons/iconfont/material-icons.css'

const app = createApp(App)

app.use(Vuesax, {})
app.use(createPinia())
app.use(router)

app.mount('#app')
