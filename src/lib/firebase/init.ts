// src/lib/firebase/init.ts

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFunctions, Functions } from 'firebase/functions';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getMessaging, Messaging } from 'firebase/messaging'; // For Push Notifications

import firebaseConfig, { validateFirebaseConfig } from './config';

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let functions: Functions | null = null;
let storage: FirebaseStorage | null = null;
let messaging: Messaging | null = null;

// Validate the config before attempting initialization
const isConfigValid = validateFirebaseConfig();

if (isConfigValid) {
    // Initialize Firebase only if config is valid
    if (!getApps().length) {
        // Initialize the primary Firebase app instance
        try {
            firebaseApp = initializeApp(firebaseConfig);
            console.log("Firebase initialized successfully.");
        } catch (error) {
            console.error("Firebase initialization error:", error);
            // Handle initialization error appropriately
            // Maybe set a global state indicating Firebase is unavailable
        }
    } else {
        // Use the existing app instance if already initialized
        firebaseApp = getApp();
        console.log("Using existing Firebase app instance.");
    }

    // Initialize specific Firebase services if the app was initialized successfully
    if (firebaseApp) {
        try {
            auth = getAuth(firebaseApp);
            db = getFirestore(firebaseApp);
            functions = getFunctions(firebaseApp); // Optional: Initialize Cloud Functions
            storage = getStorage(firebaseApp); // Optional: Initialize Cloud Storage
            // Initialize Messaging only in client-side environment
            if (typeof window !== 'undefined') {
                try {
                    messaging = getMessaging(firebaseApp);
                    console.log("Firebase Messaging initialized (client-side).");
                    // Request permission or get token here if needed automatically
                } catch (messagingError) {
                    console.warn("Firebase Messaging initialization failed (client-side):", messagingError);
                    // This can fail if service workers aren't set up correctly,
                    // or if the environment doesn't support it.
                }
            }
        } catch (serviceError) {
            console.error("Error initializing Firebase services:", serviceError);
        }
    }
} else {
    console.warn("Firebase initialization skipped due to invalid configuration.");
}


// Export the initialized services (or null if initialization failed)
export { firebaseApp, auth, db, functions, storage, messaging };