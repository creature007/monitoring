import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import PrimeVue from 'primevue/config'

// PrimeVue komponentlari
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Chart from 'primevue/chart'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import ProgressSpinner from 'primevue/progressspinner'

const app = createApp(App)

// Komponentlarni global register qilish
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Chart', Chart)
app.component('Card', Card)
app.component('Button', Button)
app.component('Calendar', Calendar)
app.component('Dialog', Dialog)
app.component('Toast', Toast)
app.component('ProgressSpinner', ProgressSpinner)

app.use(router)
app.use(store)
app.use(PrimeVue)
app.use(ToastService)

app.mount('#app')
