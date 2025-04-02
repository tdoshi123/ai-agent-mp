import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDaCGAQHBmZwUFzE5qkbQLWGjnDlozmdl0",
  authDomain: "ai-agent-marketplace-99964.firebaseapp.com",
  projectId: "ai-agent-marketplace-99964",
  storageBucket: "ai-agent-marketplace-99964.applestorage.app",
  messagingSenderId: "632473956934",
  appId: "1:632473956934:web:2a77550a9854c2597fd047",
  measurementId: "G-CWY47B7GMC",
  databaseURL: "https://ai-agent-marketplace-99964-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

// Configure persistence for auth
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });

// Monitor connection state
const connectedRef = ref(database, 'info/connected');
onValue(connectedRef, (snap) => {
  if (snap.val() === true) {
    console.log('Connected to Firebase');
  } else {
    console.log('Not connected to Firebase');
  }
});
