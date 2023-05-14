import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { createPinia } from 'pinia';

import { IonicVue } from '@ionic/vue';

// Ionic CSS
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

import './theme/variables.css';
import { VueFire, VueFireAuth } from 'vuefire';

// Firebase
import { firebaseApp } from '@/firestore';
import * as firebaseui from 'firebaseui';
import { getAuth } from 'firebase/auth';

import 'firebaseui/dist/firebaseui.css';

const pinia = createPinia();

const app = createApp(App)
	.use(IonicVue)
	.use(pinia)
	.use(router)
	.use(VueFire, {
		firebaseApp,
		modules: [VueFireAuth()],
	});

const auth = getAuth();

router.isReady().then(() => {
	app.mount('#app');
});
