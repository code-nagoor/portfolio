/**
 * js/firebase.js
 * Firebase Modular SDK initialization and Firestore integration.
 * Edit this file to configure your Firebase Project credentials.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ==========================================================================
// FIREBASE CONFIGURATION
// Replace the values below with your Firebase Project configurations
// which you can obtain from the Firebase Console (Settings > Project settings)
// ==========================================================================
const firebaseConfig = {
    apiKey: "AIzaSyANMfRN5a_bGnsnP6mDEgZ2AKm2D3-WZEA",
    authDomain: "portfolio-b0cdc.firebaseapp.com",
    projectId: "portfolio-b0cdc",
    storageBucket: "portfolio-b0cdc.firebasestorage.app",
    messagingSenderId: "768246274723",
    appId: "1:768246274723:web:2a5d5e611e107a6917bd16"
};

// Check if current configurations are still placeholders
const isConfigMock = !firebaseConfig.projectId || firebaseConfig.projectId.includes("YOUR_PROJECT_ID");

let db = null;

if (!isConfigMock) {
    try {
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        console.log("Firebase App & Firestore initialized successfully.");
    } catch (error) {
        console.error("Error initializing Firebase App:", error);
    }
} else {
    console.warn("Firebase config contains placeholders. Submissions will be simulated locally. Please configure Firebase in js/firebase.js.");
}

/**
 * Submits the contact form data to Firebase Firestore
 * Fallbacks to a simulated local log if configuration holds placeholder credentials.
 * 
 * @param {string} name - Contact sender name
 * @param {string} email - Contact sender email address
 * @param {string} subject - Contact message subject
 * @param {string} message - Contact message body content
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function submitContactForm(name, email, subject, message) {
    // Basic structural checks
    if (!name || !email || !subject || !message) {
        throw new Error("Missing required form data.");
    }

    const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        createdAt: serverTimestamp ? serverTimestamp() : new Date()
    };

    // If config is mock, simulate submission
    if (isConfigMock || !db) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("%c[Mock Firebase Submission]", "color: #2563EB; font-weight: bold;", payload);
                resolve({
                    success: true,
                    message: "Simulation Successful! (To store actual messages in Firestore, configure js/firebase.js with your project credentials)"
                });
            }, 1000);
        });
    }

    try {
        const contactsCol = collection(db, "contacts");
        await addDoc(contactsCol, payload);
        return {
            success: true,
            message: "Your message has been sent successfully! Thank you for getting in touch."
        };
    } catch (error) {
        console.error("Firestore submit error:", error);
        throw new Error(error.message || "Failed to submit form to Firestore.");
    }
}
