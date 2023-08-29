<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-back-button></ion-back-button>
				</ion-buttons>
				<ion-title>Valora un centre</ion-title>
				<ion-progress-bar
					type="indeterminate"
					:style="{ display: loading ? 'block' : 'none' }"
				></ion-progress-bar>
			</ion-toolbar>
		</ion-header>
		<ion-content class="ion-padding">
			<h2>Valora {{ school.name }}</h2>
			<h3>Puntuació</h3>
			<ion-range
				style="margin: 0 1rem"
				v-model="stars"
				min="0"
				max="5"
				:snaps="true"
				:step="0.5"
				:ticks="true"
			/>
			<div style="display: flex; justify-content: center; width: 100%">
				<b class="ion-text-lg-center">{{
					stars + ' estrell' + (stars === 1 ? 'a' : 'es')
				}}</b>
			</div>
			<h3>Ressenya</h3>
			<ion-textarea
				v-model="text"
				placeholder="Escriu quelcom interessant..."
			></ion-textarea>
			<ion-button @click="submit" style="margin: 1.5rem 0">Enviar</ion-button
			><br />
			<ion-text
				>Si envies la valoració amb text, apareixerà a altres usuaris acompanyat
				del teu nom d'usuari i la valoració.
			</ion-text>
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
	IonPage,
	IonContent,
	IonHeader,
	IonToolbar,
	IonProgressBar,
	IonTitle,
	IonBackButton,
	IonButtons,
	IonRange,
	IonText,
	IonTextarea,
	alertController,
} from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import { schoolData } from '@/data';
import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { getCurrentUser, useCurrentUser, useFirestore } from 'vuefire';

const loading = ref(true);
onMounted(() => {
	loading.value = false;
});

const route = useRoute();
const router = useRouter();
const school = schoolData.find(
	(item) => item.id === parseInt(route.params.id[0])
);

const stars = ref(0);
const text = ref('');

const user = useCurrentUser();
const firestore = useFirestore();

async function submit() {
	if (!user.value?.uid) return;
	// Ressenya
	const schoolRef = doc(firestore, 'reviews', route.params.id[0].toString());
	const snap = await getDoc(schoolRef);
	if (snap.data() === undefined) {
		await setDoc(schoolRef, {
			count: 1,
			total: stars.value,
		});
	} else {
		await updateDoc(schoolRef, {
			count: increment(1),
			total: increment(stars.value),
		});
	}

	const reviewRef = doc(
		firestore,
		'reviews/' + route.params.id[0] + '/list/',
		snap?.data()?.count ? (snap?.data()?.count + 1).toString() : '1'
	);

	const existSnap = await getDoc(reviewRef);
	if (existSnap.exists()) {
		await updateDoc(reviewRef, {
			author: {
				email: user.value?.email,
				name: user.value?.displayName,
			},
			stars: stars.value,
			text: text.value.trim(),
		});
	} else {
		await setDoc(reviewRef, {
			author: {
				email: user.value?.email,
				name: user.value?.displayName,
			},
			stars: stars.value,
			text: text.value.trim(),
		});
	}

	const userRef = doc(useFirestore(), 'users/' + user.value.uid);

	const existUserRef = await getDoc(userRef);

	if (!existUserRef.exists()) {
		const alert = await alertController.create({
			header: 'Compte antic',
			message:
				"El teu perfil ha estat creat amb una versió antiga de CercaFutur. Crea'n un altre o actualitza el teu perfil.",
			buttons: [
				{
					text: "D'acord",
				},
			],
		});
		await alert.present();
	}

	router.back();
}
</script>

<style scoped></style>
