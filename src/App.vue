<template>
	<ion-app>
		<ion-router-outlet />
	</ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
</script>
<style>
.schoolgrid {
	display: grid;
	gap: 0;
	grid-auto-flow: row;
}

.schoolgrid > ion-card {
	margin: 10px 10px;
}
@media (min-width: 640px) {
	.schoolgrid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}
@media (min-width: 1024px) {
	.schoolgrid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}

ion-toolbar {
	backdrop-filter: blur(8px) !important;
	z-index: 10;
}
</style>
