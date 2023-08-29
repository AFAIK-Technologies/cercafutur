<template>
	<TabLayout :loading="loading">
		<div style="height: 50vh; width: 100%">
			<l-map
				v-model="zoom"
				v-model:zoom="zoom"
				:center="center"
				:use-global-leaflet="false"
				max-zoom="17"
				min-zoom="10"
				world-copy-jump
				inertia-deceleration="1000"
				:options="{ boxZoom: false, attributionControl: false }"
				style="border-radius: 8px"
			>
				<l-tile-layer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					,
				></l-tile-layer>
				<l-control-layers />
				<l-marker
					v-for="school in schoolsMap"
					:key="school.id"
					:lat-lng="[...school.properties.location]"
				>
					<l-tooltip>{{ school.name }}</l-tooltip>
				</l-marker>
				<l-circle-marker
					v-if="geo.lastError === null && coords"
					:color="'#2880CA'"
					:radius="8"
					:lat-lng="coords"
				></l-circle-marker>
			</l-map>
		</div>
		<ion-toggle
			style="margin-top: 8px"
			color="medium"
			v-model="filtersToggle"
			ref="filtersToggleEl"
			>Filtres</ion-toggle
		>
		<Filters
			:enabled="filtersToggle"
			v-model="schools.filters"
			:no-sliders="true"
		/>
	</TabLayout>
</template>

<script setup lang="ts">
import {
	LMap,
	LTileLayer,
	LMarker,
	LControlLayers,
	LTooltip,
	LCircleMarker,
} from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import { SchoolFull } from '@/data';
import { IonToggle } from '@ionic/vue';

import TabLayout from '@/layout/tabLayout.vue';
import { Ref, ref, watch } from 'vue';
import Filters from '@/components/filters.vue';
import { useGeoStore } from '@/stores/geo';
import { useSchoolsStore } from '@/stores/schools';

const filtersToggle = ref(false);
const loading = ref(false);

const center = [41.37836, 2.1503];
const coords = ref<null | [number, number]>(null);

const schools = useSchoolsStore();

const schoolsMap: Ref<SchoolFull[]> = ref([]);

update();

watch([filtersToggle, schools.filters], update);

async function update() {
	console.log(schools.filters);
	schoolsMap.value = filtersToggle.value
		? await schools.getFiltered()
		: schools.schoolList;
}

const zoom = ref(14);

const geo = useGeoStore();

geo.updateGeo().then(() => {
	coords.value = geo.geoAsArray;
});
</script>
