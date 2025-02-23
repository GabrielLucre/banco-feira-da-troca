import { getApps, initializeApp } from "firebase/app";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";

const apiKeyFirebaseComandas = import.meta.env.VITE_FIREBASE_COMANDAS_APIKEY;
const authDomainFirebaseComandas = import.meta.env.VITE_FIREBASE_COMANDAS_AUTHDOMAIN;
const projectIdFirebaseComandas = import.meta.env.VITE_FIREBASE_COMANDAS_PROJECTID;
const storageBucketFirebaseComandas = import.meta.env.VITE_FIREBASE_COMANDAS_STORAGEBUCKET;
const messagingSenderIdFirebaseComandas = import.meta.env.VITE_FIREBASE_COMANDAS_MESSAINGSENDERID;
const appIdFirebaseComandas = import.meta.env.VITE_FIREBASE_COMANDAS_APPID;

const apiKeyFirebaseMessages = import.meta.env.VITE_FIREBASE_MESSAGES_APIKEY;
const authDomainFirebaseMessages = import.meta.env.VITE_FIREBASE_MESSAGES_AUTHDOMAIN;
const projectIdFirebaseMessages = import.meta.env.VITE_FIREBASE_MESSAGES_PROJECTID;
const storageBucketFirebaseMessages = import.meta.env.VITE_FIREBASE_MESSAGES_STORAGEBUCKET;
const messagingSenderIdFirebaseMessages = import.meta.env.VITE_FIREBASE_MESSAGES_MESSAINGSENDERID;
const appIdFirebaseMessages = import.meta.env.VITE_FIREBASE_MESSAGES_APPID;
const measurementIdFirebaseMessages = import.meta.env.VITE_FIREBASE_MESSAGES_MEASUREMENTID;

const firebaseConfigComandas = {
    apiKey: apiKeyFirebaseComandas,
    authDomain: authDomainFirebaseComandas,
    projectId: projectIdFirebaseComandas,
    storageBucket: storageBucketFirebaseComandas,
    messagingSenderId: messagingSenderIdFirebaseComandas,
    appId: appIdFirebaseComandas,
};

const firebaseConfigMessages = {
    apiKey: apiKeyFirebaseMessages,
    authDomain: authDomainFirebaseMessages,
    projectId: projectIdFirebaseMessages,
    storageBucket: storageBucketFirebaseMessages,
    messagingSenderId: messagingSenderIdFirebaseMessages,
    appId: appIdFirebaseMessages,
    measurementId: measurementIdFirebaseMessages
};

const appMessages = getApps().find(app => app.name === "messages") || initializeApp(firebaseConfigMessages, "messages");
const appComandas = getApps().find(app => app.name === "comandas") || initializeApp(firebaseConfigComandas, "comandas");

const dbMessages = getFirestore(appMessages);
const dbComandas = getFirestore(appComandas);

export { addDoc, collection, dbComandas, dbMessages, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, where };

