<template>
	<ion-card color="light">
		<div
			v-if="content === 'map'"
			style="
				width: 100%;
				height: 200px;
				position: relative;
				box-sizing: border-box;
			"
		>
			<l-map
				:center="school.properties.location"
				zoom="15"
				:use-global-leaflet="false"
				max-zoom="15"
				min-zoom="15"
				world-copy-jump
				inertia-deceleration="1000"
				:options="{
					boxZoom: false,
					attributionControl: false,
					zoomControl: false,
					dragging: false,
				}"
				ref="map"
				style="height: 100%"
			>
				<l-tile-layer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					,
				></l-tile-layer>
				<l-marker :lat-lng="[...school.properties.location]"></l-marker>
			</l-map>
			<span
				style="
					box-sizing: border-box;
					position: absolute;
					bottom: 0;
					z-index: 450;
					width: 100%;
					text-align: center;
					background: rgba(217, 204, 185, 0.43);
					padding: 2px;
					backdrop-filter: blur(4px);
					color: #000000;
				"
			>
				{{ school.properties.address }}
			</span>
		</div>

		<img
			v-else
			style="
				height: 200px;
				width: 100%;
				overflow: hidden;
				object-position: center;
				object-fit: cover;
				background-color: gray;
			"
			:alt="school.name"
			:src="school.images?.[0].src ?? '/imgplaceholder.png'"
		/>
		<ion-card-header>
			<ion-card-title
				class="ion-activatable"
				style="position: relative; overflow: hidden; border-radius: 4px"
				@click="router.push(`/school/${school.id}`)"
				>{{ school.name }}
				<ion-ripple-effect style="color: #868686"></ion-ripple-effect>
			</ion-card-title>
			<ion-card-subtitle>
				{{ convert(school.type, 'type') + '.' }}
				{{ schools.convertSchoolPhases(school.phase) }}</ion-card-subtitle
			>
		</ion-card-header>

		<ion-card-content style="padding-bottom: 0">
			<ion-grid style="padding: 0">
				<ion-row>
					<ion-col
						v-if="props.school?.distance || props.school?.distance === 0"
						style="padding: 0; font-size: 16px"
					>
						<b>{{
							((d: number) =>
								d > 950
									? `${(d / 1000).toLocaleString()} km`
									: `${d.toLocaleString()} m`)(
								Math.round((school.distance * 1000) / 50) * 50
							)
						}}</b>
					</ion-col>
					<ion-col
						class=""
						style="
							display: flex;
							place-items: baseline;
							justify-content: end;

							padding: 0;
							text-align: right;
						"
					>
						<ion-text style="">
							{{
								props.school.rates
									? (school?.rates?.count
											? (school?.rates?.total / school?.rates?.count).toFixed(2)
											: '?') + ' / 5'
									: 'Sense ressenyes'
							}}
						</ion-text>
						<ion-icon
							aria-hidden="true"
							style="margin-left: 8px"
							:icon="
								starIcons[
									Math.floor(
										Math.round(
											(school.rates?.total / school.rates?.count / 5) * 3 * 100
										) / 100
									) ?? 0
								]
							"
						></ion-icon>
					</ion-col>
				</ion-row>
			</ion-grid>
		</ion-card-content>

		<ion-button
			fill="clear"
			@click="content = content === 'map' ? 'picture' : 'map'"
			:disabled="!school.images?.[0].src"
			>{{ content === 'map' ? 'Fotos' : 'Mapa' }}</ion-button
		>
		<ion-button @click="router.push(`/school/${school.id}`)" fill="clear"
			>Veure centre</ion-button
		>
	</ion-card>
</template>

<script setup lang="ts">
import {
	IonText,
	IonIcon,
	IonGrid,
	IonCol,
	IonRow,
	IonCard,
	IonCardTitle,
	IonCardSubtitle,
	IonCardHeader,
	IonCardContent,
	IonRippleEffect,
} from '@ionic/vue';
import { star, starHalf, starOutline } from 'ionicons/icons';
import { School, convert, SchoolFull } from '@/data';
import { useRouter } from 'vue-router';
import { useSchoolsStore } from '@/stores/schools';
import { useGeoStore } from '@/stores/geo';
import {
	LMap,
	LTileLayer,
	LMarker,
	LControlLayers,
	LTooltip,
	LCircleMarker,
} from '@vue-leaflet/vue-leaflet';
import { onMounted, Ref, ref } from 'vue';

const props = defineProps<{
	school: SchoolFull;
}>();

const schools = useSchoolsStore();

const router = useRouter();
const geo = useGeoStore();
const content: Ref<'picture' | 'map'> = ref(
	props.school.images?.[0].src ? 'picture' : 'map'
);
const map: Ref<null | typeof LMap> = ref(null);

const starIcons = [starOutline, starHalf, star];
</script>

<style scoped></style>
