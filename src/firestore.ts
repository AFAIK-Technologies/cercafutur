import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import * as FirestoreData from './firestore.json';

export const firebaseApp = initializeApp(FirestoreData);

export const db = getFirestore(firebaseApp);
