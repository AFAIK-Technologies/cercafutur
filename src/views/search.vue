<template>
	<TabLayout>
		<ion-searchbar v-model="query" placeholder="Cerca per nom"></ion-searchbar>
		<ion-select :label="'Ordena per'" v-model="order">
			<ion-select-option v-for="option in orderOptions" :value="option.id">{{
				option.show
			}}</ion-select-option>
		</ion-select>

		<SchoolComp v-for="school in results" :school="school" :geo="geoData" />
	</TabLayout>
</template>

<script setup lang="ts">
import TabLayout from '@/layout/tabLayout.vue';

import { Geolocation } from '@capacitor/geolocation';
import { School, schoolData } from '@/data';
import SchoolComp from '@/components/schoolComp.vue';
import { IonSearchbar } from '@ionic/vue';

import { computed, ref, Ref } from 'vue';
import { distancekm } from '@/utils';

const geoData: Ref<number[] | null> = ref(null);

const query = ref('');

const loading = ref(true);

const results = computed(() => {
	return geoData.value
		? schoolData
				.filter((school) => {
					return school.name.includes(query.value);
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
				.sort(orderOptions.find((item) => item.id === order.value)?.function)
		: [];
});

const orderOptions: {
	id: string;
	show: string;
	function: (a: School, b: School) => any;
}[] = [
	{
		id: 'distance',
		show: 'Distància',
		function: (a, b) => a.distance - b.distance,
	},
	{
		id: 'name',
		show: 'Nom',
		function: (a, b) => a.name.localeCompare(b.name),
	},
	/*
	{
		id: 'score',
		show: 'Puntuació',
		function: (a, b) => (Number.isNaN(a.rates?.total / a.rates?.count) ? 0 a.rates?.total / a.rates?.count) - (Number.isNaN(b.rates?.total / b.rates?.count) ? 0 b.rates?.total / b.rates?.count)
	}

		 */
];

const order = ref(orderOptions[0].id);

Geolocation.getCurrentPosition().then((value) => {
	geoData.value = [
		Math.round(value.coords.latitude * 1e3) / 1e3,
		Math.round(value.coords.longitude * 1e3) / 1e3,
	];
	loading.value = false;
});
</script>
