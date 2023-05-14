<template>
	<TabLayout :loading="loading">
		<div id="iconHeader">
			<img src="/logoBigYellow.png" alt="Logotip de CercaFutur" height="150" />
		</div>
		<h3>Centres més propers</h3>
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
import TabLayout from '@/layout/tabLayout.vue';
import { School, schoolData } from '@/data';
import { Geolocation, Position } from '@capacitor/geolocation';
import { reactive, ref } from 'vue';
import type { Ref } from 'vue';
import SchoolComp from '@/components/schoolComp.vue';
import { useCollection, useFirestore } from 'vuefire';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { distancekm } from '@/utils';

const geoData: Ref<number[] | null> = ref(null);

const recommended: Ref<School[] | null> = ref(null);

const loading = ref(true);

Geolocation.getCurrentPosition().then(async (value) => {
	geoData.value = [
		Math.round(value.coords.latitude * 1e3) / 1e3,
		Math.round(value.coords.longitude * 1e3) / 1e3,
	];

	recommended.value = schoolData
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
		.sort((a, b) => a.distance - b.distance)
		.slice(0, 3);

	const q = query(
		collection(useFirestore(), 'reviews'),
		where(
			'__name__',
			'in',
			schoolData.map((item) => item.id.toString())
		)
	);
	const snapshot = await getDocs(q);
	console.log(snapshot);
	snapshot.docs.forEach((item) => {
		const index = recommended.value?.findIndex(
			(o) => o.id === parseInt(item.id)
		);
		//@ts-ignore
		recommended.value[index].rates = item.data();
	});
	loading.value = false;
});
</script>

<style scoped>
#iconHeader {
	display: flex;
	justify-content: center;
}
</style>
