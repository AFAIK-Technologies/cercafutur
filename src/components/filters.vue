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
				v-model="filterData[filter.id]"
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
				v-model="filterData[filter.id]"
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
import { reactive, Ref, ref, watch, watchEffect } from 'vue';
import { SchoolFilters } from '@/stores/schools';

const emit = defineEmits(['update:modelValue']);

const props = withDefaults(
	defineProps<{ enabled?: boolean; noSliders?: boolean; modelValue: any }>(),
	{
		enabled: true,
		noSliders: false,
	}
);

const filterData: Ref<SchoolFilters> = ref(props.modelValue);

watch([filterData], () => {
	emit('update:modelValue', filterData.value);
	console.log(filterData.value);
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
		type: 'multiple',
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
				show: 'Batxillerat',
				id: 'postsecondary',
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
