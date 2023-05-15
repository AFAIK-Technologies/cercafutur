<template>
	<ion-card color="light" @click="router.push(`/school/${school.id}`)">
		<ion-text class="ion-padding" v-if="school.images === null"
			><i>No hi ha imatges disponibles.</i></ion-text
		>
		<img
			v-else
			style="
				height: 200px;
				width: 100%;
				overflow: hidden;
				object-position: center;
				object-fit: cover;
			"
			:alt="school.name"
			:src="school.images[0].src"
		/>
		<ion-card-header>
			<ion-card-title>{{ school.name }}</ion-card-title>
			<ion-card-subtitle>
				{{ convert(school.type, 'type') + '.' }}
				{{ convert(school.phase, 'phase') }}</ion-card-subtitle
			>
		</ion-card-header>

		<ion-card-content>
			<ion-grid style="padding: 0">
				<ion-row>
					<ion-col style="padding: 0">
						{{ `A ${Math.round(school.distance * 10) * 100} m de tu` }}
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
								school.rates
									? school.rates?.total / school.rates?.count + ' / 5'
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
import { School, convert } from '@/data';
import { useRouter } from 'vue-router';

const props = defineProps<{
	school: School;
	geo: number[];
}>();

const router = useRouter();

const starIcons = [starOutline, starHalf, star];
</script>

<style scoped></style>
