import React, { useState, useEffect, useCallback } from 'react';
import { fetchChillQuote } from '../services/geminiService';
import { ICONS } from '../constants';
import Card from '../components/ui/Card';

const ChillModePage = (): React.ReactNode => {
    const [quote, setQuote] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const getQuote = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const newQuote = await fetchChillQuote();
            setQuote(newQuote);
        } catch (err) {
            setError('Could not fetch a quote right now. Please take a quiet moment for yourself.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getQuote();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="relative min-h-full w-full flex flex-col items-center justify-center p-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 animate-gradient-xy"></div>
            <style>{`
                @keyframes gradient-xy {
                    0%, 100% {
                        background-size: 400% 400%;
                        background-position: 0% 50%;
                    }
                    50% {
                        background-size: 200% 200%;
                        background-position: 100% 50%;
                    }
                }
                .animate-gradient-xy {
                    animation: gradient-xy 15s ease infinite;
                }
            `}</style>
            
            <h2 className="relative z-10 text-2xl font-bold text-center text-slate-700/80 mb-6 px-4" lang="ml">
                ഇതാണ് യഥാർത്ഥ നീ 🫡
            </h2>

            <Card className="z-10 text-center w-full max-w-lg bg-white/70 backdrop-blur-md">
                <h1 className="text-2xl font-bold text-slate-800 mb-4">Chill Mode</h1>
                <div className="min-h-[120px] flex items-center justify-center">
                    {isLoading && <ICONS.Loader className="w-8 h-8 text-indigo-500 animate-spin" />}
                    {error && <p className="text-red-500">{error}</p>}
                    {!isLoading && !error && (
                        <blockquote className="text-xl font-medium text-slate-700" lang="ml">
                           {quote}
                        </blockquote>
                    )}
                </div>
                 <button 
                    onClick={getQuote}
                    disabled={isLoading}
                    className="mt-6 text-sm text-indigo-600 hover:text-indigo-800 disabled:text-slate-400 transition-colors"
                >
                    {isLoading ? 'Thinking...' : 'Another one'}
                </button>
            </Card>
        </div>
    );
};

export default ChillModePage;