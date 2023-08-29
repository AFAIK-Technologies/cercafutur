<template>
	<TabLayout :loading="loading">
		<div v-if="userLoaded && user && !submitted">
			<div
				style="
					background: rgb(235, 68, 90, 0.4);
					padding: 8px;
					border-radius: 4px;
				"
				v-if="!user.emailVerified"
			>
				<ion-text style="display: block; margin-bottom: 8px"
					>El correu elèctrònic no està verificat. No podràs fer ressenyes fins
					que ho facis.</ion-text
				>
				<ion-button @click="resendVerification" color="dark" fill="outline"
					>Reenviar verificació</ion-button
				>
			</div>

			<ion-list lines="inset">
				<ion-item>
					Nom d'usuari:
					<b style="margin-left: 0.25rem">{{
						user?.providerData[0]?.displayName
					}}</b>
				</ion-item>
				<ion-item>
					Correu electrònic:
					<b style="margin-left: 0.25rem">{{ user?.providerData[0]?.email }}</b>
				</ion-item>
			</ion-list>
			<ion-button @click="presentActionSheet">Administra</ion-button>
		</div>
		<div v-else>
			<ion-text>
				Inicia sessió per deixar ressenyes i afegir centres a la teva llista de
				preferits.
			</ion-text>
			<ion-segment
				ref="sectionEl"
				v-model:value="section"
				@ionChange="
					section = $event.target.value;
					submitted = false;
				"
				style="margin-top: 1rem"
			>
				<ion-segment-button value="signup">
					<ion-label>Crear un compte</ion-label>
				</ion-segment-button>
				<ion-segment-button value="signin">
					<ion-label>Iniciar sessió</ion-label>
				</ion-segment-button>
			</ion-segment>
			<div
				style="
					display: flex;
					flex-direction: column;
					justify-content: center;
					place-items: center;
				"
			>
				<ion-list v-if="section === 'signin'" class="input-list">
					<ion-item>
						<ion-input
							:class="{ 'ion-invalid ion-touched': signInError }"
							label-placement="floating"
							label="Correu electrònic"
							type="email"
							placeholder="correu@exemple.com"
							error-text="Correu electrònic o contrasenya incorrectes"
							v-model="inputEmailSignin"
						></ion-input>
					</ion-item>
					<ion-item>
						<ion-input
							label-placement="floating"
							label="Contrasenya"
							type="password"
							v-model="inputPasswordSignin"
						></ion-input>
					</ion-item>
				</ion-list>
				<ion-list v-else class="input-list">
					<ion-item>
						<ion-input
							:class="{
								'ion-invalid ion-touched': signUpError.usernameTooShort,
							}"
							label-placement="floating"
							label="Nom d'usuari"
							:counter="true"
							autocomplete="off"
							maxlength="20"
							v-model="inputUsernameSignup"
							helper-text="Entre 4 i 20 caràcters. Pot contenir lletres majúscules i minúscules i nombres."
							error-text="Entre 4 i 20 caràcters. Pot contenir lletres majúscules i minúscules i nombres."
						></ion-input>
					</ion-item>
					<ion-item>
						<ion-input
							:class="{ 'ion-invalid ion-touched': signUpError.emailCheckFail }"
							label-placement="floating"
							label="Correu electrònic"
							type="email"
							placeholder="correu@exemple.com"
							autocomplete="email"
							v-model="inputEmailSignup"
							error-text="Adreça invàlida"
						></ion-input>
					</ion-item>
					<ion-item>
						<ion-input
							label-placement="floating"
							label="Contrasenya"
							type="password"
							autocomplete="new-password"
							:counter="true"
							minlength="8"
							helper-text="8 caràcters com a mínim amb lletres majúscules i minúscules i algun nombre."
							v-model="inputPasswordSignup"
							:class="{
								'ion-invalid ion-touched': signUpError.passwordCheckFail,
							}"
							error-text="8 caràcters com a mínim amb lletres majúscules i minúscules i algun nombre."
						></ion-input>
					</ion-item>
					<ion-item>
						<ion-input
							label-placement="floating"
							label="Confirma contrasenya"
							type="password"
							autocomplete="off"
							:counter="true"
							minlength="8"
							v-model="inputPasswordRepeatSignup"
							:class="{
								'ion-invalid ion-touched': signUpError.passwordsNotMatch,
							}"
							error-text="Les contrasenyes no són iguals."
						></ion-input>
					</ion-item>

					<ion-item>
						<ion-select
							placeholder="Selecciona..."
							v-model="inputRoleSignup"
							label="Rol"
						>
							<ion-select-option value="parent">Pare / mare</ion-select-option>
							<ion-select-option value="student">Alumne</ion-select-option>
							<ion-select-option value="teacher">Professor</ion-select-option>
							<ion-select-option value="other">Altres</ion-select-option>
						</ion-select>
					</ion-item>
				</ion-list>
				<ion-button style="max-width: 520px" @click="submit">
					{{ section === 'signup' ? 'Crear un compte' : 'Iniciar sessió' }}
				</ion-button>
			</div>
		</div>
		<p>
			CercaFutur utilitza Firebase Auth per l'autenticació. Totes les dades
			estan encriptades.
		</p>
	</TabLayout>
</template>

<script setup lang="ts">
import {
	IonSegment,
	IonSelect,
	IonSelectOption,
	IonList,
	IonItem,
	IonInput,
	IonSegmentButton,
	IonButton,
	alertController,
	actionSheetController,
	useIonRouter,
} from '@ionic/vue';

import TabLayout from '@/layout/tabLayout.vue';
import {
	getCurrentUser,
	useCurrentUser,
	useFirebaseAuth,
	useFirestore,
	useIsCurrentUserLoaded,
} from 'vuefire';
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	Auth,
	updateProfile,
	sendEmailVerification,
} from 'firebase/auth';
import { reactive, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { doc, setDoc } from 'firebase/firestore';

const user = useCurrentUser();
const userLoaded = useIsCurrentUserLoaded();
const auth = useFirebaseAuth() as Auth;
const firestore = useFirestore();
const route = useRoute();
const router = useIonRouter();

const sectionEl = ref();
const section = ref('signup');

const loading = ref(false);

const inputEmailSignin = ref('');
const inputPasswordSignin = ref('');
const inputEmailSignup = ref('');
const inputUsernameSignup = ref('');
const inputPasswordSignup = ref('');
const inputPasswordRepeatSignup = ref('');
const inputRoleSignup = ref('');

const inputs = reactive({
	signin: {
		email: inputEmailSignin,
		password: inputPasswordSignin,
	},
	signup: {
		email: inputEmailSignup,
		username: inputUsernameSignup,
		password: inputPasswordSignup,
		passwordRepeat: inputPasswordRepeatSignup,
		role: inputRoleSignup,
	},
});

const signInError = ref(false);
const signUpError = reactive({
	passwordsNotMatch: false,
	passwordCheckFail: false,
	emailCheckFail: false,
	usernameTooShort: false,
	usernameCheckFail: false,
});
const submitted = ref(false);

function submit() {
	submitted.value = true;
	if (section.value === 'signin') {
		loading.value = true;
		signInError.value = false;
		signInWithEmailAndPassword(
			auth,
			inputs.signin.email,
			inputs.signin.password
		)
			.catch((error) => {
				reportError(error, 'Inici de sessió fallat.');
			})
			.finally(() => {
				submitted.value = false;
				loading.value = false;
			});
	} else {
		const fields = [];
		for (const errorKey in signUpError) {
			//@ts-ignore
			signUpError[errorKey] = false;
		}

		for (const field of Object.values(inputs.signup)) {
			fields.push(field);
		}
		if (fields.includes('')) {
			return;
		}
		username: {
			if (inputs.signup.username.length < 4) {
				signUpError.usernameTooShort = true;
				break username;
			}
			if (!checkUsername(inputs.signup.username)) {
				signUpError.usernameCheckFail = true;
				break username;
			}
		}
		if (!checkEmail(inputs.signup.email)) {
			signUpError.emailCheckFail = true;
			return;
		}

		if (
			!inputs.signup.password.match(
				/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
			)
		) {
			signUpError.passwordCheckFail = true;
			return;
		}
		if (inputs.signup.passwordRepeat !== inputs.signup.password) {
			signUpError.passwordsNotMatch = true;
			return;
		}

		if (Object.values(signUpError).includes(true)) return;

		// TODO Comprovar ús del nom

		loading.value = true;
		createUserWithEmailAndPassword(
			auth,
			inputs.signup.email,
			inputs.signup.password
		)
			.then((userCredential) => {
				// Nom d'usuari
				//@ts-ignore
				updateProfile(auth.currentUser, {
					displayName: inputs.signup.username,
				})
					.then(async () => {
						if (user.value?.uid) {
							// Base de dades
							const userRef = doc(firestore, 'users/' + user.value.uid);
							await setDoc(userRef, {
								name: user.value.displayName!,
								email: user.value.email!,
								role: inputRoleSignup,
							});
						} else {
							reportError(
								undefined,
								'Error en accedir a la base de dades',
								"L'identificador de l'usuari no està disponible."
							);
						}
					})
					.catch((error) => {
						console.log(error);
						if (error.code === 'auth/invalid-email') {
							signUpError.emailCheckFail = true;
						}
						reportError(error, 'Error en establir el nom');
					})
					.finally(() => {
						submitted.value = false;
						loading.value = false;
					});
			})
			.catch((error) => {
				reportError(error, 'Creació de compte fallada');
				loading.value = false;
			});
	}
}

function checkEmail(str: string) {
	return str.match(
		/^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
	);
}

function checkUsername(str: string) {
	return str.match(/^[a-zA-Z0-9_.-]*$/);
}

async function reportError(
	error: { code: any; message: any } | undefined,
	header: string,
	message = ''
) {
	const alert = await alertController.create({
		header: 'Error',
		subHeader: header,
		message:
			message +
				(error &&
					`Codi d'error: ${error.code} \n Missatge: ${error.message}`) || '',
		buttons: ["D'acord"],
	});

	await alert.present();
}

async function signOut() {
	//@ts-ignore
	const prevName = auth.currentUser.providerData[0].displayName;
	await auth.signOut();

	const alert = await alertController.create({
		header: 'Sessió tancada',
		message: `La sessió de ${prevName} ha estat tancada.`,
		buttons: ["D'acord"],
	});

	await alert.present();
}
/*
const result = ref('');
*/
const presentActionSheet = async () => {
	const actionSheet = await actionSheetController.create({
		header: 'Administració del compte',
		buttons: [
			{
				text: 'Tancar la sessió',
				role: 'destructive',
				data: {
					action: 'signOut',
				},
			},
			{
				text: "Veure ID d'usuari",
				data: {
					action: 'viewId',
				},
			},
			{
				text: "Canviar nom d'usuari",
				data: {
					action: 'changeUsername',
				},
			},
			{
				text: 'Cancel·lar',
				role: 'cancel',
				data: {
					action: 'cancel',
				},
			},
		],
	});

	await actionSheet.present();

	const res = await actionSheet.onDidDismiss();
	if (res.data?.action === 'signOut') {
		signOut();
	} else if (res.data?.action === 'changeUsername') {
		let newUsername: string | null = null;
		while (
			newUsername === null ||
			newUsername.length < 4 ||
			!checkUsername(newUsername)
		) {
			const alert = await alertController.create({
				header: "Canviar nom d'usuari",
				message:
					(auth.currentUser?.displayName
						? `El teu nom d'usuari és: ${auth.currentUser?.displayName}.`
						: "No tens cap nom d'usuari establert.") +
					' Ha de ser entre 4 i 20 caràcters i pot contenir lletres majúscules i minúscules, nombres i algun símbol.',
				inputs: [
					{
						type: 'text',
						placeholder: "Nou nom d'usuari",
						attributes: {
							maxlength: 20,
						},
					},
				],
				buttons: [
					{
						text: 'Cancel·lar',
						role: 'cancel',
					},
					{
						text: "D'acord",
					},
				],
			});
			await alert.present();
			const resUsername = await alert.onDidDismiss();
			newUsername = resUsername.data.values[0];
			if (newUsername === '' || resUsername.role === 'cancel') return;
		}
		console.log(newUsername);

		updateProfile(auth.currentUser, {
			displayName: newUsername,
		})
			.then(async () => {
				const alert = await alertController.create({
					header: "Nom d'usuari establert",
					message: `S'ha canviat el teu nom d'usuari a ${auth.currentUser?.displayName}. És possible que els canvis triguin una estona a aplicar-se.`,
					buttons: [
						{
							text: "D'acord",
						},
					],
				});
				await alert.present();
			})
			.catch((error) => {
				console.log(error);
				reportError(error, 'Error en establir el nom');
			});
	} else if (res.data?.action === 'viewId') {
		const thisUser = await getCurrentUser();
		const alert = await alertController.create({
			header: "ID d'usuari",
			message: `El teu ID d'usuari és: \n ${auth.currentUser?.uid}.`,
			buttons: ["D'acord"],
		});

		await alert.present();
	}
};

function resendVerification() {
	loading.value = true;
	sendEmailVerification(auth.currentUser)
		.then(async () => {
			loading.value = false;
			const alert = await alertController.create({
				header: 'Correu de verificació enviat',
				message: `Fes clic a l'enllaç que has rebut a ${user.value.email}.`,
				buttons: ["D'acord"],
			});
			await alert.present();
		})
		.catch(async (e) => {
			loading.value = false;
			if (e.message.includes('auth/too-many-requests')) {
				const alert = await alertController.create({
					header: 'Error en enviar correu de verificació',
					message: `Espera una estona abans d'enviar-ne un altre.`,
					buttons: ["D'acord"],
				});
				await alert.present();
			} else reportError(e, 'Error en enviar correu de verificació');
		});
	// .finally() s'executa quan .then() ha acabat, fet que causa que loading sigui true
	// fins que l'alerta s'amaga.
}

watchEffect(async () => {
	if (route.query.unverified) {
		const alert = await alertController.create({
			header: 'Correu electrònic no verificat',
			message:
				"No has verificat l'adreça de correu electrònic. Vols tornar a enviar el correu de verificació?",
			buttons: [
				{
					text: 'Cancel·lar',
					role: 'cancel',
				},
				{
					text: 'Reenviar',
				},
			],
		});
		router.replace('/tabs/profile');
		await alert.present();

		const res = await alert.onDidDismiss();
	}
});
</script>

<style>
ion-input {
	--border-color: var(--ion-color-light);
}

.input-list > ion-item {
	margin-bottom: 0.25rem;
	max-width: 520px;
}

.action-sheet-destructive {
	color: #c10000 !important;
}
</style>
