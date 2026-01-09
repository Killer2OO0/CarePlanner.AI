# CarePlanner.AI 🏥

**CarePlanner.AI** is an intelligent, privacy-focused health management platform designed to empower patients with chronic conditions (such as Diabetes and Hypertension). By leveraging Generative AI and real-time data analytics, it transforms raw health logs into actionable daily plans, insightful visualization, and personalized medical advice.

![Project Status](https://img.shields.io/badge/Status-Active_Development-green)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js_15_|_Firebase_|_Genkit-blue)

---

## 🌟 Key Features

### 1. 🧠 AI-Powered Daily Planner
The core of CarePlanner.AI is its ability to generate dynamic daily schedules.
-   **Context-Aware**: Analyzes the patient's age, condition, medications, and last 7 days of vital logs.
-   **Structured Recommendations**: Creates a tailored JSON-based plan including:
    -   **Tasks**: Specific times for medication, meals, and exercise.
    -   **Targets**: Calculated safe ranges for Glucose and BP.
    -   **Insights**: AI-driven analysis of recent trends (e.g., "Glucose stability improved by 10%").
-   **Safety First**: Automatically detects critical vital signs and escalates warnings (e.g., "Seek medical attention").

### 2. 🤖 Dr. AI Assistant (Chatbot) realtime streaming
A highly responsive, context-aware chatbot for instant health queries.
-   **RAG-Lite Architecture**: Injects the patient's profile and recent health logs directly into the prompt context.
-   **Streaming Responses**: Uses Vercel AI SDK patterns and Genkit streaming to deliver "typing-effect" responses for better UX.
-   **Optimized Prompts**: engineered for concise, medically relevant, and empathetic answers.

### 3. 📊 Real-Time Health Analytics
Visualizes complex health data into easy-to-understand trends.
-   **Interactive Charts**: Uses `Recharts` to display Glucose, Blood Pressure (Variable Width), and Weight trends over time.
-   **Trend Analysis**: Calculates "Time in Range" (TIR) and visualizes improved/declining health streaks.

### 4. 📚 Intelligent Knowledge Feed
Delivers curated educational content to keep patients informed.
-   **Condition-Specific**: Fetches articles relevant *only* to the user's diagnosed condition (e.g., "Low Sodium Diet" for Hypertension).
-   **AI Summarization**: Generates bite-sized summaries and tags for quick reading.

### 5. 🛡️ Offline-First Architecture
Built for reliability in all network conditions.
-   **Firestore Persistence**: Enables `persistentLocalCache` to store data on the device.
-   **Offline Banner**: A reactive UI component (`OfflineBanner.tsx`) that acts as a circuit breaker, notifying users when connectivity is lost while keeping the app functional.

### 6. ♿ Inclusive Design
-   **Accessibility (A11y)**: Fully navigable via keyboard; ARIA labels on all interactive elements.
-   **Responsive UI**: Mobile-first design using Tailwind CSS for a seamless experience on phones and desktops.

---

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | [Next.js 15 (App Router)](https://nextjs.org/), React 19, TypeScript |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) (Dark Mode, Typography) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database** | [Firebase Firestore](https://firebase.google.com/) (NoSQL, Realtime) |
| **AI Layer** | [Google Genkit](https://github.com/firebase/genkit), [Ollama](https://ollama.ai/) (Local LLMs) |
| **Validation** | [Zod](https://zod.dev/) (Schema Validation for AI Output) |
| **Charts** | [Recharts](https://recharts.org/) |

---

## 📂 Project Structure

```bash
├── app/
│   ├── actions.ts       # Server Actions for AI generation (Plans, Facts, Articles)
│   ├── api/chat/        # Route Handler for Streaming Chatbot Response
│   ├── learn/           # Educational Content Page
│   ├── layout.tsx       # Root Layout (Navbar, Offline Banner, Fonts)
│   └── page.tsx         # Dashboard (Analytics, Daily Plan)
├── components/
│   ├── AnalyticsCards.tsx # Metric Summary Cards
│   ├── ChatWidget.tsx   # Floating AI Chat Interface
│   ├── DailyPlan.tsx    # AI Plan UI Renderer
│   ├── Navbar.tsx       # Responsive Navigation
│   ├── OfflineBanner.tsx# Connectivity Status Indicator
│   └── Trends.tsx       # Recharts Visualization Component
├── lib/
│   ├── ai.ts            # Genkit / Ollama Configuration
│   ├── firebase.ts      # Firebase Init & Persistence Config
│   └── models.ts        # TypeScript Interfaces (Patient, LogEntry)
└── scripts/
    ├── seed_firestore.mjs # Database Seeding Utility
```

---

## 🚀 Getting Started

### Prerequisites
-   **Node.js** (v18 or higher)
-   **Ollama** running locally (default: `http://localhost:11434`)
-   **Firebase Project** with Firestore enabled

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Yuvaraja28/CarePlanner.AI.git
    cd CarePlanner.AI
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env.local` file in the root:
    ```env
    # Firebase Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    
    # AI Backend
    OLLAMA_URL=http://localhost:11434
    ```

4.  **Seed the Database** (Optional for Demo)
    Populate Firestore with sample patient data:
    ```bash
    node scripts/seed_firestore.mjs
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:3000` to view the app.

---

## 🔮 Future Roadmap

-   [ ] **Wearable Integration**: Sync with Apple Health / Google Fit.
-   [ ] **Multi-Profile Support**: Clinical dashboard for doctors.
-   [ ] **Voice Interface**: Voice-to-text logging for elderly patients.
-   [ ] **Medication Reminders**: Push notifications for pill intake.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
