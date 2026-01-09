"use client";

import { api } from '@/lib/api';
import { Article } from '@/lib/models';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { BookOpen, Sparkles, Loader } from 'lucide-react';
import { generateNewArticles } from '@/app/actions';

export default function LearnPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [generating, setGenerating] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    useEffect(() => {
        const fetchKnowledge = async () => {
            const data = await api.getKnowledge();
            // Sort by Date (Newest First). If no date, treat as old (0).
            data.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
            setArticles(data);
        }
        fetchKnowledge();
    }, []);

    const handleGenerateMore = async () => {
        setGenerating(true);
        try {
            // Get seeded patient condition
            const patient = await api.getPatient("demo_patient");
            const existingTitles = articles.map(a => a.title);

            // Hardcoded "English" for now or add selector?
            // For simplicitly, defaulting to English as Learn page doesn't have selector yet.
            const newContent = await generateNewArticles(patient.condition, existingTitles, "English");

            // Save to Firestore
            let nextId = articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 1;

            const newArticles: Article[] = [];
            for (const item of newContent) {
                const article: Article = {
                    id: nextId++,
                    title: item.title,
                    category: item.category,
                    summary: item.summary,
                    content: item.content,
                    date: new Date().toISOString()
                };

                await api.addArticle(article);
                newArticles.push(article);
            }

            // Update State: Add new ones to top/list and re-sort?
            // Since we want newest first, simply unshift or re-sort.
            setArticles(prev => {
                const updated = [...prev, ...newArticles];
                return updated.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
            });

        } catch (e) {
            console.error("Failed to generate articles", e);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-cyan-400" />
                        Knowledge Hub
                    </h1>
                    <button
                        onClick={handleGenerateMore}
                        disabled={generating}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-5 py-2 rounded-xl font-medium shadow-lg shadow-purple-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {generating ? <Loader className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        {generating ? "AI is writing..." : "Generate New Articles"}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <div
                            key={article.id}
                            onClick={() => setSelectedArticle(article)}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:bg-slate-800 transition-all group cursor-pointer flex flex-col h-full hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-900/10"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-cyan-500 bg-cyan-950/30 px-2 py-1 rounded">
                                    {article.category}
                                </span>
                                {article.date && (
                                    <span className="text-xs text-slate-500">
                                        {new Date(article.date).toLocaleDateString()}
                                    </span>
                                )}
                            </div>

                            <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-cyan-400 transition-colors">
                                {article.title}
                            </h3>

                            <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                                {article.summary}
                            </p>

                            <div className="mt-auto pt-4 border-t border-slate-800/50">
                                <span className="text-xs text-slate-500 line-clamp-2">
                                    {article.content}
                                </span>
                            </div>

                        </div>
                    ))}
                </div>
            </main>

            {/* Modal Overlay */}
            {selectedArticle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        onClick={() => setSelectedArticle(null)}
                    ></div>

                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
                        {/* Header */}
                        <div className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-800 p-6 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-500 bg-cyan-950/30 px-2 py-1 rounded inline-block">
                                        {selectedArticle.category}
                                    </span>
                                    {selectedArticle.date && (
                                        <span className="text-xs text-slate-500">
                                            {new Date(selectedArticle.date).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold text-white">{selectedArticle.title}</h2>
                            </div>
                            <button
                                onClick={() => setSelectedArticle(null)}
                                className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 text-slate-300 leading-relaxed text-lg space-y-4">
                            {/* We might want to render paragraphs if content has newlines,
                                but for now it's usually one big block from AI or DB.
                                Let's split by newline for better formatting if present. */}
                            {selectedArticle.content.split('\n').map((paragraph, idx) => (
                                <p key={idx} className="min-h-[1em]">{paragraph}</p>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                            <p className="text-sm text-slate-500 italic">
                                Generated by AI based on your health profile. Always consult a clinician for medical advice.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
