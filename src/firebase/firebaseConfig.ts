import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCS9ayPGJ56EtfFmvzyvUD6fColn20gCwo",
    authDomain: "mantra-rwa.firebaseapp.com",
    databaseURL: "https://mantra-rwa-default-rtdb.firebaseio.com",
    projectId: "mantra-rwa",
    storageBucket: "mantra-rwa.appspot.com",
    messagingSenderId: "38608185388",
    appId: "1:38608185388:web:0ad8e43e830c8320ca4989",
    measurementId: "G-JDSDLKLL68"
  };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };