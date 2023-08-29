<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-back-button></ion-back-button>
				</ion-buttons>
				<ion-title>Estableix l'ubicació</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding">
			<div style="height: 75vh; margin-bottom: 0.5rem">
				<l-map
					id="map"
					v-model="center"
					v-model:zoom="zoom"
					v-model:center="center"
					:use-global-leaflet="false"
					max-zoom="17"
					min-zoom="10"
					world-copy-jump
					inertia-deceleration="1000"
					:options="{ boxZoom: false, attributionControl: false }"
					@update:center="handleMove"
					ref="map"
				>
					<l-tile-layer
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					></l-tile-layer>
					<l-control-layers />
					<l-circle-marker :lat-lng="center"></l-circle-marker>
				</l-map>
			</div>
			<b>
				{{
					geo.geocoding
						? geo.customAddress
						: `Coordenades: ${
								Math.round(
									(Array.isArray(center) ? center[0] : center.lat) * 10e4
								) / 10e4
						  }, ${
								Math.round(
									(Array.isArray(center) ? center[1] : center.lng) * 10e4
								) / 10e4
						  }`
				}}
			</b>
			<div style="display: flex; justify-content: space-between">
				<ion-button @click="router.back()">Cancel·lar</ion-button>
				<ion-button @click="handleDone">Fet</ion-button>
			</div>
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import {
	IonPage,
	IonContent,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonBackButton,
	IonButtons,
	IonText,
	IonButton,
} from '@ionic/vue';
import {
	LControlLayers,
	LTileLayer,
	LMap,
	LCircleMarker,
} from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import { Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGeoStore } from '@/stores/geo';
import { useSchoolsStore } from '@/stores/schools';

const zoom = ref(14);
const event = ref(null);
const map: Ref<null | HTMLElement> = ref(null);

const router = useRouter();
const geo = useGeoStore();
const schools = useSchoolsStore();

const center = ref(
	geo.customGeo ? geo.geoAsArray : { lat: 41.3783, lng: 2.1503 }
);

async function handleMove(pos: { lat: number; lng: number }) {
	center.value[0] = pos.lat;
	center.value[1] = pos.lng;
	if (geo.geocoding) {
		const response = await fetch(
			`https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.lat},${
				pos.lng
			}&key=${import.meta.env.VITE_MAPS_API_KEY}`
		);
		geo.customAddress = (await response.json()).results[0].formatted_address;
	}
}
if (!geo.geocoding) {
	console.warn("Clau d'API de Google Maps no proporcionada.");
}
function handleDone() {
	geo.data.latitude = center.value[0];
	geo.data.longitude = center.value[1];
	geo.lastCustom.latitude = center.value[0];
	geo.lastCustom.longitude = center.value[1];

	schools.updateDistance(true);
	geo.justChangedCustom = true;
	router.back();
}
</script>

<style scoped></style>
