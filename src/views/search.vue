<template>
	<TabLayout :loading="loading">
		<ion-searchbar
			v-model="searchQuery"
			placeholder="Cerca per nom"
		></ion-searchbar>
		<ion-select
			:label="'Ordena per'"
			:value="order"
			@ion-dismiss="handleSortChange"
		>
			<ion-select-option
				v-for="option in orderOptions"
				:value="option.id"
				:key="option.id"
				:disabled="option.id === 'distance' && !geo.data.longitude"
				>{{ option.show }}
			</ion-select-option>
		</ion-select>
		<div class="schoolgrid">
			<SchoolComp v-for="school in results" :school="school" :key="school.id" />
		</div>
	</TabLayout>
</template>

<script setup lang="ts">
import TabLayout from '@/layout/tabLayout.vue';

import { School, SchoolFull } from '@/data';
import SchoolComp from '@/components/schoolComp.vue';
import { IonSearchbar } from '@ionic/vue';

import { ref, Ref, watch } from 'vue';
import { useSchoolsStore } from '@/stores/schools';
import { storeToRefs } from 'pinia';
import { useGeoStore } from '@/stores/geo';

const searchQuery = ref('');

const loading = ref(true);

const schools = useSchoolsStore();
const { searchSchools } = storeToRefs(schools);

const results: Ref<SchoolFull[]> = ref([]);

const geo = useGeoStore();

const orderOptions: {
	id: string;
	show: string;
	function: (a: SchoolFull, b: SchoolFull) => any;
}[] = [
	{
		id: 'distance',
		show: 'Distància',
		function: (a, b) => a?.distance - b?.distance,
	},
	{
		id: 'name',
		show: 'Nom',
		function: (a, b) =>
			a.name
				.replace('Institut ', '')
				.replace('Escola ', '')
				.localeCompare(b.name.replace('Institut ', '').replace('Escola ', '')),
	},
	{
		id: 'score',
		show: 'Puntuació',
		function: (a, b) =>
			(Number.isNaN(b.rates?.total / b.rates?.count)
				? 0
				: b.rates?.total / b.rates?.count) -
			(Number.isNaN(a.rates?.total / a.rates?.count)
				? 0
				: a.rates?.total / a.rates?.count),
	},
];

const order: Ref<string> = ref(orderOptions[0].id);

async function update() {
	loading.value = true;
	await schools.updateAll();
	if (!geo.data.longitude && order.value === 'distance') {
		order.value = 'score';
	}
	const sortFunction = orderOptions.find(
		(item) => item.id === order.value
	)?.function;

	results.value = searchSchools.value(searchQuery.value).sort(sortFunction);
	loading.value = false;
}

update();

watch([order, searchQuery], update);

function handleSortChange(event: any) {
	order.value = event.target.value;
}
</script>
