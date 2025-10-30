import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

/* PrimeVue */
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css';

/* CSS */
import "./assets/style.css";
import "./assets/var.css";

/* PrimeVue Components */
import Button from 'primevue/button';
import ToggleSwitch from 'primevue/toggleswitch';
import Divider from 'primevue/divider';


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
app.component('Divider', Divider);

app.mount('#app');
