import { Patient, LogEntry, Article, Plan, Trends } from './models';

export function generatePatientPlan(
    patient: Patient,
    logs: LogEntry[],
    articles: Article[]
): { plan: Plan; trends: Trends } {
    // 1. Analyze Recent Vitals (Last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentLogs = logs.filter(l => new Date(l.timestamp) >= oneWeekAgo);
    const glucoseLogs = recentLogs.filter(l => l.type === 'Glucose');
    const bpLogs = recentLogs.filter(l => l.type === 'Blood Pressure');

    // 2. Determine State
    let avgGlucose = 0;
    if (glucoseLogs.length > 0) {
        avgGlucose = glucoseLogs.reduce((acc, curr) => acc + curr.value, 0) / glucoseLogs.length;
    }


    let glucoseState = 'Stable';
    if (avgGlucose > 180) glucoseState = 'High';
    if (avgGlucose < 70 && avgGlucose > 0) glucoseState = 'Low';

    // 3. Generate Insight
    let insight = "Your vitals are stable. Keep up the good work!";
    if (glucoseState === 'High') {
        insight = `Your average glucose (${Math.floor(avgGlucose)} mg/dL) is high this week. Focus on low-carb meals.`;
    } else if (glucoseState === 'Low') {
        insight = `Your glucose has been low (${Math.floor(avgGlucose)} mg/dL). Ensure you have emergency snacks ready.`;
    }

    // 4. Generate Tasks
    const tasks = [
        { task: "Morning Walk", time: "07:00 AM" }, // Base task
    ];

    if (patient.medications.includes("Metformin")) {
        tasks.push({ task: "Take Metformin", time: "08:00 AM" });
    }

    // Dynamic Tasks
    if (glucoseState === 'High') {
        tasks.push({ task: "Check Ketones", time: "10:00 AM" });
        tasks.push({ task: "Drink 1L Water", time: "02:00 PM" });
    }
    if (glucoseState === 'Low') {
        tasks.push({ task: "Check Glucose (Post-Meal)", time: "01:00 PM" });
    }

    tasks.push({ task: "Log Vitals", time: "08:00 PM" });

    // 5. Select Citations (Guidelines)
    const citations: Article[] = [];
    if (patient.condition.includes("Diabetes")) {
        const article = articles.find(a => a.title.includes("A1C")) || articles[0];
        if (article) citations.push(article);

        if (glucoseState === 'High') {
            const dietArticle = articles.find(a => a.title.includes("Eating")) || articles[2];
            if (dietArticle) citations.push(dietArticle);
        }
    }

    // 6. Calculate Stats for Trends
    let tir = 0;
    if (glucoseLogs.length > 0) {
        const inRange = glucoseLogs.filter(l => l.value >= 70 && l.value <= 180);
        tir = Math.floor((inRange.length / glucoseLogs.length) * 100);
    }

    return {
        plan: {
            message: insight, // Use insight as the main message too
            tasks: tasks,
            targets: {
                glucose_min: 70,
                glucose_max: 180,
            },
            citations: citations
        },
        trends: {
            insight: insight,
            stats: {
                tir: tir,
                streak: 5, // Mock streak for now
                bp_control: 85 // Mock BP control
            }
        }
    };
}
