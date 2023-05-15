<template>
	<TabLayout>
		<div style="height: 50vh; width: 100%">
			<l-map
				v-model="zoom"
				v-model:zoom="zoom"
				:center="coords"
				@move="log('move')"
				:use-global-leaflet="false"
				max-zoom="17"
				min-zoom="10"
				world-copy-jump
				inertia-deceleration="1000"
				:options="{ boxZoom: false, attributionControl: false }"
			>
				<l-tile-layer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				></l-tile-layer>
				<l-control-layers />
				<l-marker
					v-for="school in schoolData"
					:lat-lng="[...school.properties.location]"
					@moveend="log('moveend')"
				>
					<l-tooltip>{{ school.name }}</l-tooltip>
				</l-marker>
			</l-map>
		</div>
		<ion-toggle
			style="margin-top: 8px"
			color="medium"
			v-model="filtersToggle"
			ref="filtersToggleEl"
			:disabled="true"
			>Filtres</ion-toggle
		>
		<Filters
			@filterChange="
				(data) => {
					filterData = data;
				}
			"
			:enabled="filtersToggle"
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
} from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import { schoolData } from '@/data';
import { IonToggle } from '@ionic/vue';

import TabLayout from '@/layout/tabLayout.vue';
import { computed, reactive, ref } from 'vue';
import Filters from '@/components/filters.vue';

const filtersToggle = ref(false);
const filterData = ref({});

const coords = [41.378360799800085, 2.150300284782486];

const zoom = ref(14);
function log(a: string) {
	console.log(a);
}
</script>
