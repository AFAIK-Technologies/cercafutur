<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-back-button></ion-back-button>
				</ion-buttons>
				<ion-title>Informació del centre</ion-title>
				<ion-progress-bar
					type="indeterminate"
					:style="{ display: loading ? 'block' : 'none' }"
				></ion-progress-bar>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<div style="padding: 1rem 1rem">
				<header
					style="
						margin-top: 18px;
						margin-bottom: 10px;
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
					"
				>
					<h2 style="margin: 0">{{ school.name }}</h2>
					<ion-text color="medium">{{ convert(school.type, 'type') }}</ion-text>
				</header>
				<img :alt="school.name" :src="school.images[0]" />
				<div
					style="
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
						place-items: center;
					"
				>
					<h4 style="display: contents">Puntuació</h4>
					<div style="display: flex; flex-direction: row; align-items: center">
						<ion-text color="primary" style="margin-right: 4px">{{
							score
						}}</ion-text>
						<ion-icon
							v-for="i in 5"
							:icon="
								i <= score ? star : i - 0.5 <= score ? starHalf : starOutline
							"
							size="large"
							color="primary"
							>{{ i }}</ion-icon
						>
					</div>
				</div>
				<ion-card v-for="review in reviews">
					<ion-card-header>
						<ion-title style="padding-left: 0">{{
							review.stars +
							' estrell' +
							(review.stars === (1).toString() ? 'a' : 'es')
						}}</ion-title>
						<ion-card-subtitle
							>Ressenya de {{ review.author.name }}</ion-card-subtitle
						>
					</ion-card-header>
					<ion-card-content>
						{{ '"' + review.text + '"' }}
					</ion-card-content>
				</ion-card>
			</div>
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import {
	IonPage,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
	IonBackButton,
	IonButtons,
	IonText,
	IonIcon,
} from '@ionic/vue';
import { star, starOutline, starHalf } from 'ionicons/icons';
import { useRoute } from 'vue-router';
import { Review, schoolData, convert } from '@/data';
import { computed, Ref, ref } from 'vue';
import {
	collection,
	query,
	where,
	getDocs,
	doc,
	getDoc,
} from 'firebase/firestore';
import { useFirestore } from 'vuefire';

const route = useRoute();
const loading = ref(true);

console.log(parseInt(route.params.id[0]));

const school = computed(() => {
	updateReviews();
	return schoolData.find((item) => item.id === parseInt(route.params.id[0]));
});

const reviews: Ref<Review[]> = ref([]);

const score: Ref<number | null> = ref(null);

async function updateReviews() {
	if (typeof school?.value?.rates === 'undefined') {
		const docSnap = await getDoc(
			doc(useFirestore(), 'reviews', route.params.id[0].toString())
		);
		//@ts-ignore
		school.value.rates = docSnap.data();
	}
	const q = query(
		collection(useFirestore(), `reviews/${route.params.id[0]}/list`),
		where(
			'text',
			'!=',
			//@ts-ignore
			''
		)
	);
	const snapshot = await getDocs(q);

	reviews.value = [];

	snapshot.forEach((item) => {
		reviews.value.push({
			stars: item.data().stars,
			author: { name: item.data().author.name },
			text: item.data().text,
		});
	});
	loading.value = false;
	score.value = school?.value?.rates?.count
		? Math.round(
				(school?.value?.rates?.total / school?.value?.rates?.count) * 2
		  ) / 2
		: null;
}
</script>

<style scoped></style>
