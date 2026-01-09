"use client";

import Link from 'next/link';
import { api } from '@/lib/api';
import Trends from '@/components/Trends';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import DailyPlan from '@/components/DailyPlan';
import { Activity, Heart } from 'lucide-react';
import AnalyticsCards from '@/components/AnalyticsCards';
import KnowledgeFeed from '@/components/KnowledgeFeed';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("English"); // Default Language
  const patientId = "demo_patient"; // Using 'demo_patient' as it has the seeded logs

  useEffect(() => {
    loadData();
  }, [language]); // Reload when language changes

  const loadData = async () => {
    try {
      setLoading(true); // Set loading true on language switch
      const dashboardData = await api.getDashboard(patientId, language);
      setData(dashboardData);
    } catch (e) {
      console.error("Failed to load dashboard", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white flex-col gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      <p className="text-slate-400">Generating daily plan in {language}...</p>
    </div>
  );

  if (!data) return <div className="text-white">Failed to load data. Ensure backend is running.</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Welcome back, {data.profile.name}
            </h1>
            <p className="text-slate-400 mt-1">{data.plan.message}</p>
          </div>
          <div className="flex gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-900 text-white border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
            >
              <option value="English">English</option>
              <option value="Tamil">Tamil</option>
              <option value="Hindi">Hindi</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>

            <Link href="/log"
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-cyan-900/20 transition-all hover:scale-105 active:scale-95"
            >
              <Activity className="w-5 h-5" />
              Log Vitals
            </Link>
          </div>

        </div>

        {/* Insight Banner */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <div className="flex items-start gap-4">
            <div className="bg-indigo-500/10 p-3 rounded-lg text-indigo-400">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-indigo-200">Weekly Insight</h3>
              <p className="text-slate-300 mt-1">{data.trends.insight}</p>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <AnalyticsCards stats={data.trends.stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Daily Plan */}
          <div className="lg:col-span-1 space-y-6">
            <DailyPlan tasks={data.plan.tasks} />
          </div>

          {/* Right Column: Trends & Vitals */}
          <div className="lg:col-span-2 space-y-6">
            <Trends logs={data.recent_logs} targets={data.plan.targets} />
          </div>
        </div>

        {/* AI Knowledge Feed Section - Full Width */}
        <div className="pt-8 border-t border-slate-800/50">
          <KnowledgeFeed patient={data.profile} language={language} />
        </div>
      </main>
    </div>
  );
}
