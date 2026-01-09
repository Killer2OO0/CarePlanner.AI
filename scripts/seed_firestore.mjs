import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, writeBatch } from "firebase/firestore";
// Load env vars
import 'dotenv/config';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Seed Data (duplicated from models/db.ts for standalone execution)
const patients = [
    { id: "1", name: "John Doe", age: 45, condition: "Type 2 Diabetes", medications: ["Metformin", "Insulin"] },
    { id: "2", name: "Jane Smith", age: 62, condition: "Hypertension", medications: ["Lisinopril"] },
    { id: "demo_patient", name: "John Doe", age: 45, condition: "Type 2 Diabetes", medications: ["Metformin", "Insulin"] },
];

const articles = [
    {
        id: 1,
        title: "Understanding A1C",
        category: "Diabetes",
        // ... (content omitted for brevity)
    },
    // ...
];

async function seed() {
    console.log("Starting Seed...");
    const batch = writeBatch(db);

    // Seed Patients
    console.log("Seeding Patients...");
    for (const p of patients) {
        const ref = doc(db, "patients", p.id);
        batch.set(ref, p);
    }

    // Seed Articles
    console.log("Seeding Articles...");
    for (const a of articles) {
        // Use auto-id or explicit id string? Using string(id) for consistency
        const ref = doc(db, "articles", String(a.id));
        batch.set(ref, a);
    }

    // Seed Logs (Generating fresh data for demo)
    console.log("Seeding Logs...");
    const base_time = new Date();
    // For demo_patient
    for (let i = 0; i < 10; i++) {
        const time = new Date(base_time);
        time.setDate(time.getDate() - i);

        // Glucose
        const logRef1 = doc(collection(db, "logs"));
        batch.set(logRef1, {
            patient_id: "demo_patient",
            timestamp: time.toISOString(),
            type: "Glucose",
            value: Math.floor(Math.random() * (180 - 80 + 1)) + 80,
            unit: "mg/dL"
        });

        // BP
        const logRef2 = doc(collection(db, "logs"));
        batch.set(logRef2, {
            patient_id: "demo_patient",
            timestamp: time.toISOString(),
            type: "Blood Pressure",
            value: Math.floor(Math.random() * (140 - 110 + 1)) + 110,
            unit: "mmHg",
            extra_data: { diastolic: Math.floor(Math.random() * (90 - 70 + 1)) + 70 }
        });
    }

    await batch.commit();
    console.log("Done!");
    process.exit(0);
}

seed();
