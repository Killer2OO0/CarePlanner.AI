"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function Trends({ logs, targets }: { logs: any[], targets: any }) {
    // Process logs for charts
    const glucoseLogs = logs.filter(l => l.type === 'glucose').map(l => ({
        time: new Date(l.timestamp).toLocaleDateString(undefined, { weekday: 'short', hour: 'numeric' }),
        value: l.value
    }));

    const bpLogs = logs.filter(l => l.type === 'blood_pressure').map(l => ({
        time: new Date(l.timestamp).toLocaleDateString(undefined, { weekday: 'short' }),
        systolic: l.value,
        diastolic: l.extra_data?.diastolic || 0
    }));

    return (
        <div className="space-y-8">

            {/* Glucose Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center justify-between">
                    <span>Glucose Trend</span>
                    <span className="text-xs font-normal bg-slate-800 px-3 py-1 rounded-full text-slate-400">Target: 80-180 mg/dL</span>
                </h2>

                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={glucoseLogs}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                            <YAxis stroke="#64748b" domain={[40, 350]} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                                itemStyle={{ color: '#22d3ee' }}
                            />
                            <ReferenceLine y={180} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'right', value: 'High', fill: '#f59e0b', fontSize: 10 }} />
                            <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: 'Low', fill: '#ef4444', fontSize: 10 }} />
                            <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4, fill: '#0891b2' }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Blood Pressure Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-slate-100 mb-6">Blood Pressure Trend</h2>

                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={bpLogs}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                            <YAxis stroke="#64748b" domain={[50, 200]} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                            />
                            <ReferenceLine y={130} stroke="#f59e0b" strokeDasharray="3 3" />
                            <Line type="monotone" dataKey="systolic" name="Systolic" stroke="#f472b6" strokeWidth={3} />
                            <Line type="monotone" dataKey="diastolic" name="Diastolic" stroke="#a78bfa" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
}
