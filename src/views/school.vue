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
					<h2 style="margin: 0">{{ school?.name }}</h2>
					<ion-text color="primary"
						><b>{{ convert(school?.type, 'type') }}</b></ion-text
					>
				</header>
				<div
					style="
						width: 100%;
						height: 100px;
						display: flex;
						place-content: center;
						align-items: center;
						flex-direction: column;
					"
					v-if="school?.images === null"
				>
					<span>No hi ha imatges disponibles.</span>
					<ion-button @click="openBrowser('Google Images', school?.name)"
						>Cerca'n a Google
					</ion-button>
				</div>
				<template v-else>
					<img
						:alt="school?.name"
						:src="school?.images?.[imageIndex].src"
					/><br />
					<span class="ion-text-sm-left"
						>Font de la imatge: {{ school?.images?.[imageIndex].credits }}
						<a
							v-if="school?.images?.[imageIndex]?.link"
							@click="openBrowser(school?.images?.[imageIndex]?.link)"
							style="text-decoration: underline"
							>Enllaç</a
						></span
					>
				</template>

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
						<ion-text color="primary" style="margin-right: 4px"
							><b>{{
								school?.rates?.count
									? (school?.rates?.total / school?.rates?.count).toFixed(2)
									: '?'
							}}</b></ion-text
						>
						<ion-icon
							v-for="i in 5"
							:icon="
								i <= score ? star : i - 0.5 <= score ? starHalf : starOutline
							"
							size="large"
							color="primary"
							>{{ i }}
						</ion-icon>
					</div>
				</div>
				<h3>Ressenyes</h3>
				<ion-text v-if="reviews.length === 0"
					><i>No hi ha ressenyes d'aquest centre.</i><br
				/></ion-text>
				<ion-card v-else v-for="review in reviews" color="light">
					<ion-card-header>
						<ion-title style="padding-left: 0"
							>{{
								review?.stars +
								' estrell' +
								(review?.stars === '1' ? 'a' : 'es')
							}}
						</ion-title>
						<ion-card-subtitle
							>Ressenya de {{ review?.author?.name }}
						</ion-card-subtitle>
					</ion-card-header>
					<ion-card-content>
						{{ '"' + review.text + '"' }}
					</ion-card-content>
				</ion-card>
				<ion-button @click="rateRedirect">Valora aquest centre</ion-button>
				<h3>Informació</h3>
				<ion-list style="padding-top: 0" v-if="school">
					<ion-item
						>Tipus de centre:
						<b style="margin-left: 0.25rem">{{
							convert(school?.type, 'type')
						}}</b></ion-item
					>
					<ion-item
						>Fase escolar:
						<b style="margin-left: 0.25rem">{{
							convert(school?.phase, 'phase')
						}}</b></ion-item
					>
					<ion-item
						>Any de fundació:
						<b style="margin-left: 0.25rem">{{
							school?.properties.founded
						}}</b></ion-item
					>
					<ion-item
						>Adreça:
						<b
							@click="
								writeToClipboard(school?.properties.address);
								presentToast('Adreça copiada al portaretalls');
							"
							style="margin-left: 0.25rem"
							>{{ school?.properties.address }}</b
						></ion-item
					>
				</ion-list>
				<h3>Contacte</h3>
				<ion-list v-if="school">
					<ion-item v-if="school?.properties.contact?.website"
						><a @click="openBrowser(school?.properties.contact?.website)"
							>Pàgina web: <u>{{ school?.properties.contact?.website }}</u></a
						></ion-item
					>
					<ion-item v-if="school?.properties.contact?.phone">
						<a
							@click="
								writeToClipboard(school?.properties.contact?.phone);
								presentToast('Telèfon copiat al portaretalls');
							"
						>
							Telèfon: <u>{{ school?.properties.contact?.phone }}</u></a
						>
					</ion-item>
					<ion-item v-if="school?.properties.contact?.email">
						<a
							@click="
								writeToClipboard(school?.properties.contact?.email);
								presentToast('Correu electrònic copiat al portaretalls');
							"
						>
							Correu electrònic:
							<u>{{ school?.properties.contact?.email }}</u></a
						>
					</ion-item>
				</ion-list>
				<h3>Localització</h3>
				<div style="height: 200px; width: 100%">
					<l-map
						v-if="school"
						:use-global-leaflet="false"
						zoom="15"
						world-copy-jump
						:dragging="false"
						:options="{ boxZoom: false, attributionControl: false }"
						:center="school?.properties.location"
					>
						<l-tile-layer
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						></l-tile-layer>
						<l-control-layers />
						<l-marker :lat-lng="[...school?.properties.location]"></l-marker>
						<l-circle-marker
							v-if="geo.lastError === null && coords"
							:color="'#2880CA'"
							:radius="8"
							:lat-lng="coords"
						></l-circle-marker>
					</l-map>
				</div>
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
	IonList,
	IonItem,
	toastController,
	IonProgressBar,
	IonCard,
	IonCardContent,
	IonCardTitle,
	IonCardHeader,
	IonCardSubtitle,
	useIonRouter,
} from '@ionic/vue';
import {
	LMap,
	LTileLayer,
	LMarker,
	LControlLayers,
	LCircleMarker,
} from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import { star, starOutline, starHalf } from 'ionicons/icons';
import { useRoute } from 'vue-router';
import { Review, convert, SchoolFull } from '@/data';
import { Ref, ref, watchEffect, computed } from 'vue';
import {
	collection,
	query,
	where,
	getDocs,
	doc,
	getDoc,
} from 'firebase/firestore';
import { useCurrentUser, useFirestore } from 'vuefire';
import { Browser } from '@capacitor/browser';
import { Clipboard } from '@capacitor/clipboard';
import { useGeoStore } from '@/stores/geo';
import { useSchoolsStore } from '@/stores/schools';
import { User } from 'firebase/auth';

const route = useRoute();
const ionRouter = useIonRouter();
const loading = ref(true);
const schools = useSchoolsStore();

const school = computed(() => {
	if (typeof route?.params?.id === 'undefined') return null;
	loading.value = false;
	updateReviews();
	return schools.schoolList.find(
		(item) => item.id === parseInt(route.params.id ?? 1)
	);
});

const reviews: Ref<Review[]> = ref([]);

const score: Ref<number | null> = ref(null);

const imageIndex = ref(0);

const geo = useGeoStore();
const user = useCurrentUser() as unknown as Ref<User>;
const coords = ref<null | [number, number]>(null);

geo.updateGeo().then(() => {
	coords.value = geo.geoAsArray;
});

async function updateReviews() {
	if (typeof school?.value?.rates === 'undefined') {
		const docSnap = await getDoc(
			doc(useFirestore(), 'reviews', route.params.id.toString())
		);
		school.value.rates = docSnap.data() as { count: number; total: number };
	}
	const q = query(
		collection(useFirestore(), `reviews/${route.params.id}/list`),
		where('text', '!=', '')
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

const openBrowser = async (
	link: string | 'Google Images',
	query?: string | undefined
) => {
	await Browser.open({
		url:
			'https://' +
			(link === 'Google Images'
				? 'www.google.com/search?tbm=isch&q=' + encodeURI(query as string)
				: link),
	});
};

const writeToClipboard = async (text: string) => {
	await Clipboard.write({
		string: text,
	});
};

async function presentToast(text: string) {
	const toast = await toastController.create({
		message: text,
		duration: 1500,
		position: 'bottom',
	});

	await toast.present();
}

function rateRedirect(e: CustomEvent) {
	console.log('rate');
	console.log(user.value);

	if (user.value && user.value.emailVerified) {
		ionRouter.back;
		ionRouter.push(`/school/${school.value?.id}/rate`);
	} else {
		ionRouter.push(
			'/tabs/profile' + (user.value.emailVerified ? '' : '?unverified=true')
		);
	}
}
</script>

<style scoped></style>
