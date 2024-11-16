const { initializeApp } = require("firebase/app");
const { getFirestore, collection } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAFeyxHhfmnqCg7G4aP-SMH4Zl_tZcy7T8",
  authDomain: "cinelabdb.firebaseapp.com",
  projectId: "cinelabdb",
  storageBucket: "cinelabdb.firebasestorage.app",
  messagingSenderId: "176831869190",
  appId: "1:176831869190:web:40b9b0c548ce9a07cb6e87",
  measurementId: "G-TNPGSK76H4",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { db, collection };
