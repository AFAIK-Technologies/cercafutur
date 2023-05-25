import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import * as FirestoreData from './firestore.json';

console.log(FirestoreData);
export const firebaseApp = initializeApp(FirestoreData);

export const db = getFirestore(firebaseApp);
