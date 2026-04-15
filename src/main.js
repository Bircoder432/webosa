import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./styles/main.css";

// Тема больше не управляется здесь. Всегда тёмная.
createApp(App).use(createPinia()).mount("#app");
