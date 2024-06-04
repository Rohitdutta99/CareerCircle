// Import the required Firebase modules
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import getStorage function

import firebaseConfig from './firebaseConfig'; // Make sure this path is correct

// Initialize Firebase with your configuration
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(firebaseApp);

// Initialize Firebase Authentication
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

// Initialize Firebase Storage
const storage = getStorage(); // Initialize storage without passing firebaseApp

const imageDb = getStorage(firebaseApp);
const txtDb = getFirestore(firebaseApp);
// Export the necessary Firebase services
export { auth, provider, signInWithPopup, storage, db, imageDb, txtDb};
export default db;
