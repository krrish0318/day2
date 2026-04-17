import * as admin from 'firebase-admin';

// Check if app already initialized (useful for hot repopulation in dev)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault() // Using Default Credentials in GCP
    });
  } catch (err) {
    console.error('Firebase admin initialization error', err);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
