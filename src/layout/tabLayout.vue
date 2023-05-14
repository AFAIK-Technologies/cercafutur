<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>{{ route.name }}</ion-title>
				<ion-progress-bar
					type="indeterminate"
					:style="{ display: loading ? 'block' : 'none' }"
				></ion-progress-bar>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<div style="padding: 1rem 1rem">
				<slot />
			</div>
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
} from '@ionic/vue';
import { useRoute } from 'vue-router';

const props = withDefaults(defineProps<{ loading?: boolean }>(), {
	loading: false,
});

const route = useRoute();
</script>
