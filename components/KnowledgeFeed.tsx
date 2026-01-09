"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { generateHealthFacts } from '@/app/actions';
import { BookOpen, Tag } from 'lucide-react';

interface Fact {
  id: number;
  title: string;
  content: string;
  tags: string[];
}

export default function KnowledgeFeed({ patient, language }: { patient: any, language: string }) {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  // Observer for infinite scroll
  const observer = useRef<IntersectionObserver | null>(null);
  const lastFactElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Reset when language changes
  useEffect(() => {
    setFacts([]);
    setPage(0);
    setHasMore(true);
  }, [language]);

  // Fetch Facts
  useEffect(() => {
    const fetchFacts = async () => {
      setLoading(true);
      try {
        // If we already have facts for this page/language combo, skip? 
        // Checks if we are just refetching page 0 due to language change or appending

        const newFacts = await generateHealthFacts(patient, language, page);

        if (newFacts.length === 0) {
          setHasMore(false);
        } else {
          setFacts(prev => {
            // Avoid duplicates if React StrictMode fires twice
            const existingIds = new Set(prev.map(f => f.id));
            const uniqueNew = newFacts.filter((f: any) => !existingIds.has(f.id));
            return [...prev, ...uniqueNew];
          });
        }
      } catch (e) {
        console.error("Error loading facts", e);
      } finally {
        setLoading(false);
      }
    };

    fetchFacts();
  }, [page, language, patient]); // Dependencies: fetch when page or language changes

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
          <BookOpen className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">AI Health Knowledge</h2>
        <div className="ml-auto flex gap-2">
          {/* Language indicator or mini selector if needed, 
                         but currently controlled by parent page */}
          <span className="text-xs text-slate-500 px-2 py-1 border border-slate-800 rounded uppercase">
            {language}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facts.map((fact, index) => {
          const isLast = index === facts.length - 1;
          return (
            <div
              key={`${fact.id}-${index}`}
              ref={isLast ? lastFactElementRef : null}
              className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-emerald-500/50 transition-colors group"
            >
              <h3 className="text-lg font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">
                {fact.title}
              </h3>
              <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                {fact.content}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {fact.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-xs text-slate-500 bg-slate-950 px-2 py-1 rounded-md">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      )}

      {!hasMore && (
        <div className="text-center text-slate-500 text-sm py-4">
          You've reached the end of the knowledge base.
        </div>
      )}
    </div>
  );
}
