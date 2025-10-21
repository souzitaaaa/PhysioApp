import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css';

import Button from 'primevue/button';
import ToggleSwitch from 'primevue/toggleswitch';


const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.my-app-dark'
    }
  },
});

app.component('Button', Button);
app.component('ToggleSwitch', ToggleSwitch);

app.mount('#app');
