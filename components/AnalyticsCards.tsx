import { TrendingUp, Activity, Calendar } from 'lucide-react';

export default function AnalyticsCards({ stats }: { stats: any }) {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            {/* Time in Range (Glucose) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Time in Range</p>
                        <h3 className="text-3xl font-bold text-cyan-400 mt-1">{stats.tir}%</h3>
                    </div>
                    <div className="bg-cyan-900/30 p-2 rounded-lg text-cyan-400">
                        <Activity className="w-5 h-5" />
                    </div>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full transition-all duration-1000" style={{ width: `${stats.tir}%` }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Target: &gt;70% (70-180 mg/dL)</p>
            </div>

            {/* BP Control Rate */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-pink-500/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-slate-400 text-sm font-medium">BP Control</p>
                        <h3 className="text-3xl font-bold text-pink-400 mt-1">{stats.bp_control}%</h3>
                    </div>
                    <div className="bg-pink-900/30 p-2 rounded-lg text-pink-400">
                        <HeartIcon />
                    </div>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-pink-500 h-full rounded-full transition-all duration-1000" style={{ width: `${stats.bp_control}%` }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Target: &lt;130/80 mmHg</p>
            </div>

            {/* Streak */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Current Streak</p>
                        <h3 className="text-3xl font-bold text-emerald-400 mt-1">{stats.streak} <span className="text-lg font-normal text-slate-500">days</span></h3>
                    </div>
                    <div className="bg-emerald-900/30 p-2 rounded-lg text-emerald-400">
                        <Calendar className="w-5 h-5" />
                    </div>
                </div>
                <div className="flex gap-1 mt-3">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className={`h-2 flex-1 rounded-full ${i < stats.streak ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
                    ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">Keep logging daily!</p>
            </div>

        </div>
    );
}

function HeartIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
    )
}
