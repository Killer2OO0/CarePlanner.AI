import Link from 'next/link';
import { Activity, User } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
                        <Activity className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-200">CarePlanner<span className="text-cyan-500">.AI</span></span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/" aria-label="Go to Dashboard" className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors">Dashboard</Link>
                    <Link href="/learn" aria-label="Go to Learn Page" className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors">Learn</Link>
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400" aria-label="User Profile">
                        <User />
                    </div>
                </div>
            </div>
        </nav>
    );
}
