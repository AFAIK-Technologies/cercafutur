import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseApp = initializeApp({
	apiKey: 'null',
	authDomain: 'cerca-futur-afaik.firebaseapp.com',
	projectId: 'cerca-futur-afaik',
	storageBucket: 'cerca-futur-afaik.appspot.com',
	messagingSenderId: '525279481418',
	appId: '1:525279481418:web:66a54453991f45016b60b3',
});

export const db = getFirestore(firebaseApp);
