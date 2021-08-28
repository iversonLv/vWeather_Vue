import { createApp } from "vue";
import App from "./App.vue";

// element ui
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./element-variables.scss";

// i18n
import { createI18n } from "vue-i18n";
import en from "./assets/locales/en/translation.json";
import zh from "./assets/locales/zh/translation.json";

const messages = {
  en,
  zh
};
const i18n = createI18n({
  legacy: false,
  fallbackLocale: "en", // set fallback locale
  messages // set locale messages
  // If you need to specify other options, you can set other options
  // ...
});
const app = createApp(App);
app.use(ElementPlus);
app.use(i18n);
app.mount("#app");
