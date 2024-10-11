import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyBKNYgX2C7WYC_uk8otkkpP5bG0VWmmVAM",
	authDomain: "findpg-ab5d5.firebaseapp.com",
	projectId: "findpg-ab5d5",
	storageBucket: "findpg-ab5d5.appspot.com",
	messagingSenderId: "161651318698",
	appId: "1:161651318698:web:8d404451468f7baab655d3",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
