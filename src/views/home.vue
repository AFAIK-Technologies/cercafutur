<template>
	<TabLayout :loading="loading">
		<div id="iconHeader">
			<img src="/logoBigYellow.png" alt="Logotip de CercaFutur" height="150" />
		</div>
		<div style="display: flex; flex-direction: row; gap: 0.5rem">
			<h3 style="flex-grow: 1">Centres recomanats</h3>
			<ion-button :disabled="true" @click="modalOpen = true">Afina</ion-button>
		</div>

		<ion-modal :is-open="modalOpen">
			<ion-header>
				<ion-toolbar>
					<ion-title>Afina les recomanacions</ion-title>
					<ion-buttons slot="end">
						<ion-button @click="modalOpen = false">Acceptar</ion-button>
					</ion-buttons>
				</ion-toolbar>
			</ion-header>
			<ion-content class="ion-padding">
				<Filters
					@filterChange="handleFilterChange"
					:no-sliders="true"
				></Filters>
			</ion-content>
		</ion-modal>

		{{
			recommended
				? ''
				: geoData
				? 'Carregant base de dades...'
				: 'Esperant geolocalització...'
		}}
		<SchoolComp v-for="school in recommended" :school="school" :geo="geoData" />
	</TabLayout>
</template>

<script setup lang="ts">
import {
	IonModal,
	IonContent,
	IonHeader,
	IonButtons,
	IonButton,
	IonToolbar,
	IonSelect,
	IonSelectOption,
} from '@ionic/vue';
import TabLayout from '@/layout/tabLayout.vue';
import { School, schoolData } from '@/data';
import { Geolocation, Position } from '@capacitor/geolocation';
import { reactive, ref } from 'vue';
import type { Ref } from 'vue';
import SchoolComp from '@/components/schoolComp.vue';
import { useCollection, useFirestore } from 'vuefire';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { distancekm } from '@/utils';
import Filters from '@/components/filters.vue';

const geoData: Ref<number[] | null> = ref(null);

const recommended: Ref<School[] | null> = ref(null);

const loading = ref(true);

const modalOpen = ref(false);

const filterData: Ref<{
	phase: string | null;
	type: string[] | null;
	distance: null;
	score: null;
}> = ref({
	phase: null,
	type: null,
	distance: null,
	score: null,
});

function handleFilterChange(arg: any) {
	filterData.value = arg;
	fetch();
}

fetch();

function fetch() {
	Geolocation.getCurrentPosition().then(async (value) => {
		loading.value = true;

		geoData.value = [
			Math.round(value.coords.latitude * 1e3) / 1e3,
			Math.round(value.coords.longitude * 1e3) / 1e3,
		];

		recommended.value = schoolData
			.filter((item) => {
				const phase = item.phase.length === 2 ? 'both' : item.phase[0];

				return (
					(filterData.value.phase === null ||
						filterData.value?.phase === phase) &&
					(filterData.value.type === null ||
						filterData.value?.type.includes(item.type))
				);
			})
			.map((item) => {
				item.distance = distancekm(
					item.properties.location[0],
					item.properties.location[1],
					//@ts-ignore
					geoData.value[0],
					//@ts-ignore
					geoData.value[1],
					'K'
				);
				return item;
			})
			//@ts-ignore
			.sort((a, b) => a.distance - b.distance)
			.slice(0, 4);
		if (recommended.value?.length > 0) {
			const q = query(
				collection(useFirestore(), 'reviews'),
				where(
					'__name__',
					'in',
					schoolData.map((item) => item.id.toString())
				)
			);
			const snapshot = await getDocs(q);
			console.log(snapshot.docs);
			snapshot.docs.forEach((item) => {
				console.log(item);
				const index = recommended.value?.findIndex(
					(o) => o.id === parseInt(item.id)
				);
				console.log(index);
				if (index !== -1) {
					recommended.value[index].rates = item.data();
				}
			});
		}
		loading.value = false;
	});
}
</script>

<style scoped>
#iconHeader {
	display: flex;
	justify-content: center;
}
</style>
