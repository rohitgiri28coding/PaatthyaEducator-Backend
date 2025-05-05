const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  // Check if Firebase is already initialized
  if (admin.apps.length === 0) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey
      })
    });
  }
  
  return admin;
};

// Get Firestore database
const getFirestore = () => {
  const firebase = initializeFirebase();
  return firebase.firestore();
};

module.exports = {
  admin,
  initializeFirebase,
  getFirestore
}; 