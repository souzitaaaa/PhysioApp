import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

/* PrimeVue */
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css';

/* CSS */
import "./assets/style.css";
import "./assets/var.css";

/*Icons Font Awesome*/
import '@fortawesome/fontawesome-free/css/all.css'


/* PrimeVue Components */
import Button from 'primevue/button';
import ToggleSwitch from 'primevue/toggleswitch';
import Tag from 'primevue/tag';
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
import Drawer from 'primevue/drawer';
import Menu from 'primevue/menu';
import Select from 'primevue/select';
import InputMask from 'primevue/inputmask';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import DatePicker from 'primevue/datepicker';
import FileUpload from 'primevue/fileupload';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import Card from 'primevue/card';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent'
import Message from 'primevue/message';
import Timeline from 'primevue/timeline';
import MultiSelect from 'primevue/multiselect';
import Password from 'primevue/password';
import ProgressSpinner from 'primevue/progressspinner';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import DataView from 'primevue/dataview';
import Toast from 'primevue/toast';

import { myPreset } from './theme'

const app = createApp(App);

app.use(router);

app.use(PrimeVue, {
  theme: {
    preset: myPreset,
    options: {
      darkModeSelector: '.my-app-dark'
    }
  },
});

app.use(ToastService);

app.component('Toast', Toast);
app.component('DataView', DataView);
app.component('Tabs', Tabs);
app.component('TabList', TabList);
app.component('Tab', Tab);
app.component('TabPanels', TabPanels);
app.component('TabPanel', TabPanel);
app.component('ProgressSpinner', ProgressSpinner);
app.component('Password', Password);
app.component('MultiSelect', MultiSelect);
app.component('Message', Message);
app.component('Button', Button);
app.component('Tag', Tag);
app.component('ToggleSwitch', ToggleSwitch);
app.component('Divider', Divider);
app.component('Skeleton', Skeleton);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Card', Card);
app.component('Toolbar', Toolbar);
app.component('InputText', InputText);
app.component('IconField', IconField);
app.component('InputIcon', InputIcon);
app.component('Tooltip', Tooltip);
app.component('Avatar', Avatar);
app.component('Drawer', Drawer);
app.component('Menu', Menu);
app.component('Dialog', Dialog);
app.component('Select', Select);
app.component('InputMask', InputMask);
app.component('InputNumber', InputNumber);
app.component('DatePicker', DatePicker);
app.component('FileUpload', FileUpload);
app.component('Accordion', Accordion);
app.component('AccordionPanel', AccordionPanel);
app.component('AccordionHeader', AccordionHeader);
app.component('AccordionContent', AccordionContent);
app.component('Timeline', Timeline);

app.directive('tooltip', Tooltip);

app.mount('#app');
