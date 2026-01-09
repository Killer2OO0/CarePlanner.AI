import { db } from './firebase';
import { doc, getDoc, getDocs, collection, addDoc, query, where, setDoc } from 'firebase/firestore';
import { LogEntry, Patient, Article } from './models';
import { generateAIPlan } from '@/app/actions';
import { generatePatientPlan } from './plan_generator'; // Keep as fallback

export const api = {
    getPatient: async (id: string) => {
        const docRef = doc(db, "patients", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as Patient;
        } else {
            throw new Error("Patient not found");
        }
    },

    getDashboard: async (id: string, language: string = "English") => {
        // 1. Fetch Patient
        const patientRef = doc(db, "patients", id);
        const patientSnap = await getDoc(patientRef);
        if (!patientSnap.exists()) throw new Error("Patient not found");
        const patient = patientSnap.data() as Patient;

        const profile = {
            name: patient.name,
            age: patient.age,
            condition: patient.condition
        };

        // 2. Fetch Logs
        const q = query(collection(db, "logs"), where("patient_id", "==", id));
        const querySnapshot = await getDocs(q);
        const logs: LogEntry[] = [];
        querySnapshot.forEach((doc) => {
            logs.push(doc.data() as LogEntry);
        });

        // Sort logs (Client side sort for now)
        logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        // 3. Fetch Articles (Guidelines)
        const articlesSnap = await getDocs(collection(db, "articles"));
        const articles: Article[] = [];
        articlesSnap.forEach((doc) => {
            articles.push(doc.data() as Article);
        });

        // 4. Run AI Plan Generator (Server Action)
        // We try AI first, fallback to Rule-Based if it fails
        let plan, trends;
        try {
            const aiResult = await generateAIPlan(patient, logs, articles, language);

            if (aiResult) {
                plan = aiResult.plan;
                trends = aiResult.trends;
            } else {
                throw new Error("AI returned null");
            }
        } catch (e) {
            console.warn("AI Plan Generation failed. Using Rule-Based Fallback.", e);
            const ruleBased = generatePatientPlan(patient, logs, articles);
            plan = ruleBased.plan;
            trends = ruleBased.trends;
        }

        // 5. Map Logs for Frontend
        const recent_logs = logs.map(log => {
            const log_type = log.type.toLowerCase().replace(" ", "_");
            return {
                patient_id: log.patient_id,
                timestamp: log.timestamp,
                type: log_type,
                value: log.value,
                unit: log.unit,
                extra_data: log.extra_data
            };
        });

        return {
            profile,
            plan,
            trends,
            recent_logs
        };
    },

    submitLog: async (entry: LogEntry) => {
        await addDoc(collection(db, "logs"), entry);
        return { message: "Log added" };
    },

    async getKnowledge() {
        const querySnapshot = await getDocs(collection(db, "articles"));
        const articles: Article[] = [];
        querySnapshot.forEach((doc) => {
            articles.push(doc.data() as Article);
        });
        return articles;
    },

    async addArticle(article: Article) {
        // We use the ID as document ID for easier dedup checking if needed, or just stringify it
        // Updating to use setDoc to specify ID, or addDoc for auto ID. 
        // Logic in LearnPage will assign numeric IDs, so we use string(id) as key.
        const ref = doc(db, "articles", String(article.id));
        await setDoc(ref, article);
        return { message: "Article saved" };
    },

    generateSynthetic: async (id: string) => {
        // Generate locally and push to Firestore
        const base_time = new Date();
        for (let i = 0; i < 5; i++) {
            const log_types = ["Glucose", "Blood Pressure", "Heart Rate"];
            const log_type = log_types[Math.floor(Math.random() * log_types.length)];

            let val: number;
            let unit: string;
            let extra: any = null;

            if (log_type === "Glucose") {
                val = Math.floor(Math.random() * (200 - 70 + 1)) + 70;
                unit = "mg/dL";
            } else if (log_type === "Blood Pressure") {
                const systolic = Math.floor(Math.random() * (150 - 110 + 1)) + 110;
                val = systolic;
                unit = "mmHg";
                extra = { diastolic: Math.floor(Math.random() * (95 - 70 + 1)) + 70 };
            } else {
                val = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
                unit = "bpm";
            }

            const timestamp_date = new Date(base_time);
            timestamp_date.setHours(timestamp_date.getHours() - i);

            const entry: LogEntry = {
                patient_id: id,
                timestamp: timestamp_date.toISOString(),
                type: log_type,
                value: val,
                unit: unit,
                extra_data: extra
            };

            await addDoc(collection(db, "logs"), entry);
        }
    }
};
