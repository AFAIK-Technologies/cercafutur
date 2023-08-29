<template>
	<TabLayout :loading="loading">
		<div id="iconHeader">
			<img
				src="/logoBigYellow.png"
				alt="Logotip de CercaFutur"
				style="object-fit: cover"
				height="125"
			/>
		</div>
		<div style="display: flex; flex-direction: row; gap: 0.5rem">
			<h3 style="flex-grow: 1">Centres recomanats</h3>
			<ion-button @click="modalOpen = true">Afina</ion-button>
		</div>
		<ion-text v-if="schools.network === false"
			>Estàs desconnectat. Les ressenyes no estaran disponibles.</ion-text
		>
		<ion-button
			style="display: block"
			color="tertiary"
			:disabled="!geo.customGeo"
			@click="router.push('/location')"
			>{{
				geo.customGeo ? "Estableix l'ubicació" : 'Utilitzant GPS'
			}}</ion-button
		>

		<ion-modal :is-open="modalOpen" @didDismiss="update">
			<ion-header>
				<ion-toolbar>
					<ion-title>Afina les recomanacions</ion-title>

					<ion-buttons slot="end">
						<ion-button @click="modalOpen = false">Acceptar</ion-button>
					</ion-buttons>
				</ion-toolbar>
			</ion-header>
			<ion-content class="ion-padding">
				<Filters v-model="schools.filters" :no-sliders="true"></Filters>
				<ion-list>
					<ion-radio-group v-model="locationSource">
						<ion-item
							><ion-radio :disabled="gpsChange" value="gps" justify="end"
								>Ubicació per GPS</ion-radio
							></ion-item
						><ion-item
							><ion-radio :disabled="gpsChange" value="custom" justify="end"
								>Ubicació personalitzada</ion-radio
							></ion-item
						>
					</ion-radio-group>
				</ion-list>
				<ion-text v-if="gpsChange"><i>Obtenint ubicació...</i></ion-text>
				<br /><ion-text
					>Els filtres d'aquesta pàgina es sincronitzen amb els del mapa.
				</ion-text>
			</ion-content>
		</ion-modal>

		{{ recommended ? '' : loadingMessage }}
		<div class="schoolgrid">
			<SchoolComp
				v-for="school in recommended"
				:key="school.id"
				:school="school"
			/>
		</div>
	</TabLayout>
</template>

<script setup lang="ts">
import {
	IonModal,
	IonText,
	IonContent,
	IonHeader,
	IonButtons,
	IonButton,
	IonToolbar,
	IonList,
	IonRadio,
	IonRadioGroup,
	IonItem,
	alertController,
} from '@ionic/vue';
import { LControlLayers, LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';

import TabLayout from '@/layout/tabLayout.vue';
import { SchoolFull } from '@/data';

import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import SchoolComp from '@/components/schoolComp.vue';

import Filters from '@/components/filters.vue';
import { useGeoStore } from '@/stores/geo';
import { SchoolFilters, useSchoolsStore } from '@/stores/schools';
import { useIsCurrentUserLoaded } from 'vuefire';
import { useRouter } from 'vue-router';

const geoData: Ref<number[] | null> = ref(null);

const userLoaded = useIsCurrentUserLoaded();

const locationSource = ref<'gps' | 'custom'>('gps');

const router = useRouter();

const recommended: Ref<SchoolFull[] | null> = ref(null);

const loading = ref(true);
const loadingMessage = ref('Obtenint ubicació...');

const modalOpen = ref(false);

const filterData: Ref<SchoolFilters> = ref({
	phase: null,
	type: null,
});

const geo = useGeoStore();
const schools = useSchoolsStore();

const center = [41.378360799800085, 2.150300284782486];

async function checkGPSError() {
	if (geo.lastError) {
		await reportError(
			geo.lastError.code === 1 ? undefined : geo.lastError,
			'GPS no disponible',
			geo.lastError.code === 1
				? `No s'ha pogut obtenir l'ubicació. Revisa els permisos o estableix una ubicació personalitzada.`
				: `Hi ha hagut un error desconegut.`
		);
		geo.data = {};
	}
}

const gpsChange = ref(false);

watch(locationSource, async () => {
	loading.value = true;
	gpsChange.value = true;
	if (locationSource.value === 'custom') {
		geo.customGeo = true;
		geo.data.longitude = geo.lastCustom.longitude;
		geo.data.latitude = geo.lastCustom.latitude;
	} else {
		geo.customGeo = false;
		await geo.updateGeo();
		await checkGPSError();
	}
	console.log(locationSource.value, geo.data);
	gpsChange.value = false;
	schools.updateDistance(true);
	await update();
});
/*
await bloqueja el renderitzat del component
https://stackoverflow.com/questions/69183835/vue-script-setup-top-level-await-causing-template-not-to-render
 */
const geoData2 = geo.updateGeo().then(async () => {
	if (geo.lastError) {
		geo.customGeo = true;
		locationSource.value = 'custom';
		geo.data.longitude = geo.lastCustom.longitude;
		geo.data.latitude = geo.lastCustom.latitude;
	}

	schools.updateDistance();
	loadingMessage.value = 'Obtenint valoracions...';

	await schools.updateScores();

	loadingMessage.value = 'Preparant recomanacions...';

	await update();
	loading.value = false;
});

watch(geo, () => {
	if (geo.justChangedCustom) {
		update();
		geo.justChangedCustom = false;
	}
});
async function update() {
	loading.value = true;
	recommended.value = await schools.getFiltered();
	recommended.value = recommended.value.slice(0, 4);
	loading.value = false;
}

async function reportError(
	error: { code: number; message: string } | undefined,
	header: string,
	text: string
) {
	const alert = await alertController.create({
		header,
		message:
			text +
			(error
				? `\n Codi d'error: ${error?.code} \n Missatge d'error: ${error?.message}`
				: ''),
		buttons: ["D'acord"],
	});
	await alert.present();
}
</script>

<style scoped>
#iconHeader {
	display: flex;
	justify-content: center;
}
</style>
