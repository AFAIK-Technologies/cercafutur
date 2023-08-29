<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>
					<div style="display: flex; justify-content: space-between">
						<span>{{ route.name }}</span>
						<span><span>Cerca</span>Futur</span>
					</div>
				</ion-title>
				<ion-progress-bar
					type="indeterminate"
					:style="{ display: loading ? 'block' : 'none' }"
				></ion-progress-bar>
			</ion-toolbar>
			<slot name="header"></slot>
		</ion-header>
		<ion-content :fullscreen="true">
			<div style="padding: 1rem 1rem calc(1rem + 56px) 1rem">
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
