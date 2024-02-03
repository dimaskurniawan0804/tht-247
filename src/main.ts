import { createApp } from "vue";
import PrimeVue from "primevue/config";
import App from "./App.vue";
import router from "./routes";
import Menubar from "primevue/menubar";
import Button from "primevue/button";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Divider from "primevue/divider";
import InputText from "primevue/inputtext";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import "./style.css";
import "primevue/resources/themes/aura-light-green/theme.css";

const app = createApp(App);

app.use(PrimeVue);
app.use(router);
app.component("Menubar", Menubar);
app.component("Button", Button);
app.component("TabView", TabView);
app.component("TabPanel", TabPanel);
app.component("Divider", Divider);
app.component("InputText", InputText);
app.component("Toast", Toast);
app.use(ToastService);

app.mount("#app");
