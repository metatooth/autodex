import { createApp } from 'vue';
import App from './App.vue';

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faCirclePlus);
library.add(faFileArrowDown);
library.add(faSearch);
library.add(faTrash);

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount('#app');
