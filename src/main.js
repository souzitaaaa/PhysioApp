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

/*Icons Font Awesome*/ 
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

/* PrimeVue Components */
import Button from 'primevue/button';
import ToggleSwitch from 'primevue/toggleswitch';
import Divider from 'primevue/divider';
import Skeleton from 'primevue/skeleton';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Toolbar from 'primevue/toolbar';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Tooltip from 'primevue/tooltip';
import Avatar from 'primevue/avatar';


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
app.component('Skeleton', Skeleton);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Toolbar', Toolbar);
app.component('InputText', InputText);
app.component('IconField', IconField);
app.component('InputIcon', InputIcon);
app.component('Tooltip', Tooltip);
app.component('Avatar', Avatar);

app.directive('tooltip', Tooltip);

app.mount('#app');
