import { Circle } from 'lucide-react';

export default function DailyPlan({ tasks }: { tasks: any[] }) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-cyan-500 rounded-full"></span>
                Today's Plan
            </h2>

            <div className="space-y-4">
                {tasks.map((task, idx) => (
                    <div key={idx} className="group flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer">
                        <div className={`mt-1 text-slate-500 group-hover:text-cyan-400 transition-colors`}>
                            <Circle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-200 group-hover:text-white">{task.task}</p>
                            <p className="text-xs text-slate-500 font-mono mt-1">{task.time}</p>
                        </div>
                    </div>
                ))}

                {tasks.length === 0 && (
                    <p className="text-slate-500 italic">No tasks for today.</p>
                )}
            </div>
        </div>
    );
}
