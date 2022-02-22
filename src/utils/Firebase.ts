import Constants from 'expo-constants';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFunctions, Functions } from 'firebase/functions';
import { getStorage, FirebaseStorage } from 'firebase/storage';

let firebaseApp: FirebaseApp;
let auth: Auth;
let db: Firestore;
let functions: Functions;
let storage: FirebaseStorage;

if (getApps().length == 0) {
  firebaseApp = initializeApp(Constants.manifest?.web?.config?.firebase ?? {});
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);
  functions = getFunctions(firebaseApp, 'asia-northeast1');
  storage = getStorage(firebaseApp);
}

export { auth, db, functions, storage };
