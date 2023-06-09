<template>
	<ion-card color="light" @click="router.push(`/school/${props.school.id}`)">
		<img
			v-if="props.school.images"
			style="
				height: 200px;
				width: 100%;
				overflow: hidden;
				object-position: center;
				object-fit: cover;
			"
			:alt="props.school.name"
			:src="props.school.images[0].src"
		/>
		<ion-card-header>
			<ion-card-title>{{ props.school.name }}</ion-card-title>
			<ion-card-subtitle>
				{{ convert(props.school.type, 'type') + '.' }}
				{{ schools.convertSchoolPhases(props.school.phase) }}</ion-card-subtitle
			>
		</ion-card-header>

		<ion-card-content>
			<ion-grid style="padding: 0">
				<ion-row>
					<ion-col v-if="props.school?.distance" style="padding: 0">
						{{
							`A ${Math.round(props.school.distance * 10) * 100} m de ${
								geo.customGeo ? "l'ubicació establerta" : 'tu'
							}`
						}}
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
									? (props.school?.rates?.count
											? (
													props.school?.rates?.total /
													props.school?.rates?.count
											  ).toFixed(2)
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
											(props.school.rates?.total /
												props.school.rates?.count /
												5) *
												3 *
												100
										) / 100
									) ?? 0
								]
							"
						></ion-icon>
					</ion-col>
				</ion-row>
			</ion-grid>
		</ion-card-content>
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
} from '@ionic/vue';
import { star, starHalf, starOutline } from 'ionicons/icons';
import { School, convert, SchoolFull } from '@/data';
import { useRouter } from 'vue-router';
import { useSchoolsStore } from '@/stores/schools';
import { useGeoStore } from '@/stores/geo';

const props = defineProps<{
	school: SchoolFull;
}>();

const schools = useSchoolsStore();

const router = useRouter();
const geo = useGeoStore();

const starIcons = [starOutline, starHalf, star];
</script>

<style scoped></style>
