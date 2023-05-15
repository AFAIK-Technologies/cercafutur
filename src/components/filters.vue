<template>
	<ion-list>
		<ion-item
			v-for="filter in filters.filter((item) =>
				noSliders ? item.type !== 'range' : true
			)"
		>
			<ion-range
				style="margin: 0 16px"
				v-if="filter.type === 'range'"
				:snaps="filter.values.snaps"
				:ticks="filter.values.snaps"
				:min="filter.values.min"
				:max="filter.values.max"
				:pin="true"
				:step="filter.values.steps"
				:disabled="!enabled"
				@ionChange="filterData[filter.id] = $event.target.value"
				:pin-formatter="filter.values.format"
			>
				<div slot="label">{{ filter.title }}</div>
			</ion-range>
			<ion-select
				:disabled="!enabled"
				v-else
				:multiple="filter.type === 'multiple'"
				placeholder="Selecciona..."
				:label="filter.title"
				@ionChange="filterData[filter.id] = $event.target.value"
			>
				<ion-select-option v-for="option in filter.values" :value="option.id">{{
					option.show
				}}</ion-select-option>
			</ion-select>
		</ion-item>
	</ion-list>
</template>

<script setup lang="ts">
import {
	IonSelect,
	IonSelectOption,
	IonRange,
	IonList,
	IonItem,
} from '@ionic/vue';
import { reactive, watch, watchEffect } from 'vue';

const emit = defineEmits(['filterChange']);

const props = withDefaults(
	defineProps<{ enabled?: boolean; noSliders?: boolean }>(),
	{
		enabled: true,
		noSliders: false,
	}
);

const filterData: Object = reactive({
	phase: null,
	type: null,
	distance: null,
	score: null,
});

watch(filterData, () => {
	emit('filterChange', filterData);
});

const filters: {
	type: 'multiple' | 'single' | 'range';
	id: string;
	title: string;
	values:
		| { show: string; id: string }[]
		| {
				min: number;
				max: number;
				snaps: boolean;
				steps: number;
				format?: (value: number) => number;
		  };
}[] = [
	{
		type: 'single',
		title: 'Etapa educativa',
		id: 'phase',
		values: [
			{
				show: 'Primària',
				id: 'primary',
			},
			{
				show: 'ESO',
				id: 'secondary',
			},
			{
				show: 'Institut-escola',
				id: 'both',
			},
		],
	},
	{
		type: 'multiple',
		title: 'Tipus de centre',
		id: 'type',
		values: [
			{
				show: 'Públic',
				id: 'public',
			},
			{
				show: 'Concertat',
				id: 'public-funded',
			},
			{
				show: 'Privat',
				id: 'private',
			},
		],
	},
	{
		type: 'range',
		id: 'score',
		title: 'Puntuació mínima',
		values: {
			min: 0,
			max: 5,
			snaps: true,
			steps: 0.5,
			format: (value) => value,
		},
	},
];
</script>

<style scoped></style>
