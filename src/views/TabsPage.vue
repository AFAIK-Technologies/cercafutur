<template>
	<ion-page>
		<ion-tabs>
			<ion-router-outlet></ion-router-outlet>

			<ion-tab-bar slot="bottom">
				<template v-for="tab in tabs">
					<ion-tab-button :tab="tab.path" :href="`/tabs/${tab.path}`">
						<ion-icon aria-hidden="true" :icon="icons[tab.icon]"></ion-icon>
						<ion-label>{{ tab.name }}</ion-label>
					</ion-tab-button>
				</template>
			</ion-tab-bar>
		</ion-tabs>
	</ion-page>
</template>

<script setup lang="ts">
import {
	IonTabBar,
	IonTabButton,
	IonTabs,
	IonLabel,
	IonIcon,
	IonPage,
	IonRouterOutlet,
} from '@ionic/vue';
import { ellipse, square, triangle } from 'ionicons/icons';
import { tabs } from '@/router';
import * as icons from 'ionicons/icons';
import TabLayout from '@/layout/tabLayout.vue';
</script>

<style>
ion-tab-bar {
	margin-bottom: env(safe-area-inset-bottom);
	position: absolute;
	bottom: 0;
	width: 100%;
}

ion-tab-bar {
	backdrop-filter: blur(8px) !important;
	background: rgba(var(--ion-tab-bar-background-rgb), 0.7) !important;
}

ion-tab-button {
	--background: transparent;
}
</style>
