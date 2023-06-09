<template>
	<TabLayout :loading="loading">
		<div v-if="userLoaded && user && !submitted">
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
			<ion-button style="margin-top: 1rem" @click="presentActionSheet"
				>Administra</ion-button
			>
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
							helper-text="4 caràcters com a mínim."
							error-text="4 caràcters com a mínim."
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
							helper-text="8 caràcters com a mínim amb lletres majúscules i minúscules i algun nombre i símbol."
							v-model="inputPasswordSignup"
							:class="{
								'ion-invalid ion-touched': signUpError.passwordCheckFail,
							}"
							error-text="8 caràcters com a mínim amb lletres majúscules i minúscules i algun nombre i símbol."
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
					<!--
					<ion-item>
						<ion-select placeholder="Selecciona..." label="Rol">
							<ion-select-option value="parent">Pare / mare</ion-select-option>
							<ion-select-option value="student">Alumne</ion-select-option>
							<ion-select-option value="teacher">Professor</ion-select-option>
							<ion-select-option value="other">Altres</ion-select-option>
						</ion-select>
					</ion-item>--> </ion-list
				><ion-button style="max-width: 520px" @click="submit">{{
					section === 'signup' ? 'Crear un compte' : 'Iniciar sessió'
				}}</ion-button>
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
} from '@ionic/vue';

import TabLayout from '@/layout/tabLayout.vue';
import {
	getCurrentUser,
	useCurrentUser,
	useFirebaseAuth,
	useIsCurrentUserLoaded,
} from 'vuefire';
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	Auth,
	updateProfile,
	User,
} from 'firebase/auth';
import { reactive, ref } from 'vue';

const user = useCurrentUser() as unknown as User;
const userLoaded = useIsCurrentUserLoaded();
const auth = useFirebaseAuth() as Auth;

const sectionEl = ref();
const section = ref('signup');

const loading = ref(false);

const inputEmailSignin = ref('');
const inputPasswordSignin = ref('');
const inputEmailSignup = ref('');
const inputUsernameSignup = ref('');
const inputPasswordSignup = ref('');
const inputPasswordRepeatSignup = ref('');
const role = ref('');

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
	},
});

const signInError = ref(false);
const signUpError = reactive({
	passwordsNotMatch: false,
	passwordCheckFail: false,
	emailCheckFail: false,
	usernameTooShort: false,
});
const submitted = ref(false);

function submit(e: CustomEvent) {
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
		for (let errorKey in signUpError) {
			//@ts-ignore
			signUpError[errorKey] = false;
		}

		for (const field of Object.values(inputs.signup)) {
			fields.push(field);
		}
		if (fields.includes('')) {
			return;
		}
		if (inputs.signup.username.length < 4) {
			signUpError.usernameTooShort = true;
			return;
		}
		if (!checkEmail(inputs.signup.email)) {
			signUpError.emailCheckFail = true;
			return;
		}
		if (
			!inputs.signup.password.match(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&,.()/+-])[A-Za-z\d@$!%*?&,.()/+-]{8,}$/
			)
		) {
			signUpError.passwordCheckFail = true;
			return;
		}
		if (inputs.signup.passwordRepeat !== inputs.signup.password) {
			signUpError.passwordsNotMatch = true;
			return;
		}
		loading.value = true;
		createUserWithEmailAndPassword(
			auth,
			inputs.signup.email,
			inputs.signup.password
		)
			.then((userCredential) => {
				//@ts-ignore
				updateProfile(auth.currentUser, {
					displayName: inputs.signup.username,
				})
					.then(() => {})
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

async function reportError(error: any, header: string) {
	const alert = await alertController.create({
		header: 'Error',
		subHeader: header,
		message: `Codi d'error: ${error.code} \n Missatge: ${error.message}`,
		buttons: ['OK'],
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
