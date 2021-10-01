import { createApp } from 'vue'
import App from './components/App.vue'
import store from './store'

import CustomSelect from './components/CustomSelect.vue'
import Modal from './components/Modal.vue'
import Popup from './components/Popup.vue'
import TextBox from './components/TextBox.vue'
import UploadFile from './components/UploadFile.vue'

const app = createApp(App)

app.component('CustomSelect', CustomSelect)
app.component('Modal', Modal)
app.component('Popup', Popup)
app.component('TextBox', TextBox)
app.component('UploadFile', UploadFile)

app.use(store)

app.mount('#app')
