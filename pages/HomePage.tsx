import React, { useState } from 'react';
import { MicroGoal } from '../types';
import { MICRO_GOALS, CATEGORY_STYLES, ICONS } from '../constants';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { fetchMicroGoal, fetchCompletionMessage, fetchUltimateTask, fetchUltimateCompletionMessage } from '../services/geminiService';
import useLocalStorage from '../hooks/useLocalStorage';

type CheckInStatus = 'initial' | 'loading' | 'answered' | 'completing' | 'completed' | 'loading-ultimate' | 'showing-ultimate' | 'completing-ultimate' | 'completed-ultimate';

const getRandomFallbackGoal = (excludeText?: string): MicroGoal => {
  const availableGoals = excludeText ? MICRO_GOALS.filter(g => g.text !== excludeText) : MICRO_GOALS;
  const randomIndex = Math.floor(Math.random() * availableGoals.length);
  return availableGoals[randomIndex];
};

const ProgressBar = ({ count }: { count: number }) => {
    const progress = Math.min((count / 10) * 100, 100);
    return (
        <div className="w-full bg-slate-200 rounded-full h-4 mb-4 relative overflow-hidden">
            <div
                className="bg-indigo-600 h-4 rounded-full transition-all duration-500 ease-out flex items-center justify-center"
                style={{ width: `${progress}%` }}
            >
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-xs font-bold text-white mix-blend-difference filter invert">{count} / 10 Tasks</span>
            </div>
        </div>
    );
};


const HomePage = (): React.ReactNode => {
    const [status, setStatus] = useState<CheckInStatus>('initial');
    const [currentGoal, setCurrentGoal] = useState<MicroGoal | null>(null);
    const [completionMessage, setCompletionMessage] = useState<string>('');
    const [completionCount, setCompletionCount] = useLocalStorage<number>('momentum-completion-count', 0);


    const getNewGoal = async (currentGoalText?: string) => {
        setStatus('loading');
        try {
            const goal = await fetchMicroGoal(currentGoalText);
            setCurrentGoal(goal);
        } catch (error) {
            console.warn("Gemini API failed, using a fallback goal.", error);
            setCurrentGoal(getRandomFallbackGoal(currentGoalText));
        } finally {
            setStatus('answered');
        }
    };

    const handleAnswer = () => {
        getNewGoal();
    };

    const handleComplete = async () => {
        if (!currentGoal) return;
        setStatus('completing');
        try {
            const message = await fetchCompletionMessage(currentGoal);
            setCompletionMessage(message);
        } catch (error) {
            console.warn("Couldn't fetch completion message, using a fallback.", error);
            setCompletionMessage("അടിപൊളി! 🎉"); // Fallback message
        } finally {
            setStatus('completed');
            setCompletionCount(prev => prev + 1);
        }
    };

    const handleNewGoal = () => {
        getNewGoal(currentGoal?.text);
    };

    const handleReset = () => {
        setStatus('initial');
        setCurrentGoal(null);
        setCompletionCount(0);
    }
    
    const handleOfferUltimate = async () => {
        setStatus('loading-ultimate');
        try {
            const goal = await fetchUltimateTask();
            setCurrentGoal(goal);
            setStatus('showing-ultimate');
        } catch (error) {
            console.warn("Failed to fetch ultimate task, returning to normal flow.", error);
            handleReset(); // Reset if ultimate task fails
        }
    }

    const handleCompleteUltimate = async () => {
        if (!currentGoal) return;
        setStatus('completing-ultimate');
        try {
            const message = await fetchUltimateCompletionMessage(currentGoal);
            setCompletionMessage(message);
        } catch (error) {
            console.warn("Couldn't fetch ultimate completion message, using a fallback.", error);
            setCompletionMessage("You are absolutely AWESOME! 🏆");
        } finally {
            setStatus('completed-ultimate');
            setCompletionCount(0); // Reset after the final challenge
        }
    }

    const categoryStyle = currentGoal ? CATEGORY_STYLES[currentGoal.category] : null;

    const renderContent = () => {
        switch (status) {
            case 'initial':
                return (
                    <Card className="text-center">
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome!</h1>
                        <p className="text-slate-600 mb-6">Feeling up for something small today?</p>
                        <div className="flex justify-center space-x-4">
                            <Button onClick={handleAnswer} size="lg">Yes / Maybe</Button>
                        </div>
                        <p className="text-xs text-slate-400 mt-6">It's okay if not. Your pace is the right pace.</p>
                    </Card>
                );
            case 'loading':
            case 'completing':
                 return (
                    <Card className="text-center">
                        <div className="flex flex-col items-center justify-center min-h-[15rem]">
                            <ICONS.Loader className="w-12 h-12 text-indigo-500 animate-spin" />
                            <p className="text-slate-600 mt-4">
                                {status === 'loading' ? 'Generating a fresh idea...' : 'Confirming you *really* did it... 😉'}
                            </p>
                        </div>
                    </Card>
                );
            case 'loading-ultimate':
            case 'completing-ultimate':
                 return (
                    <Card className="text-center">
                        <div className="flex flex-col items-center justify-center min-h-[15rem]">
                            <ICONS.Loader className="w-12 h-12 text-amber-500 animate-spin" />
                            <p className="text-slate-600 mt-4">
                                {status === 'loading-ultimate' ? 'Forging a FINAL CHALLENGE...' : 'Witnessing your triumph... 🏆'}
                            </p>
                        </div>
                    </Card>
                );
            case 'answered':
                if (!currentGoal || !categoryStyle) return null;
                return (
                    <Card className="text-center">
                        <div className="flex flex-col items-center">
                            <div className={`mb-4 inline-flex items-center gap-x-2 rounded-full px-3 py-1 text-sm font-medium ${categoryStyle.color}`}>
                                {categoryStyle.icon}
                                {currentGoal.category}
                            </div>
                            <p className="text-xl font-medium text-slate-700 mb-6">{currentGoal.text}</p>
                            <Button onClick={handleComplete} size="lg">I did it!</Button>
                        </div>
                    </Card>
                );
            case 'showing-ultimate':
                if (!currentGoal || !categoryStyle) return null;
                return (
                    <Card className="text-center border-2 border-amber-400 bg-amber-50">
                        <div className="flex flex-col items-center">
                            <div className={`mb-4 inline-flex items-center gap-x-2 rounded-full px-3 py-1 text-sm font-medium ${categoryStyle.color}`}>
                                {categoryStyle.icon}
                                FINAL CHALLENGE
                            </div>
                            <p className="text-2xl font-bold text-amber-900 mb-6">{currentGoal.text}</p>
                            <Button onClick={handleCompleteUltimate} size="lg" className="bg-amber-500 hover:bg-amber-600 focus:ring-amber-400 text-white">
                                Challenge Complete!
                            </Button>
                        </div>
                    </Card>
                );
            case 'completed':
                return (
                    <Card className="text-center">
                        <h2 className="text-3xl font-bold text-green-700 mb-4" lang="ml">{completionMessage}</h2>
                        {completionCount >= 10 ? (
                             <div className="mt-8 p-4 bg-indigo-50 rounded-lg border-2 border-dashed border-indigo-200 animate-pulse">
                                <h3 className="font-bold text-lg text-indigo-800">You did it! You've reached the final challenge!</h3>
                                <p className="text-sm text-indigo-600 mb-4">Are you ready for your ultimate task?</p>
                                <Button onClick={handleOfferUltimate} variant="primary">
                                    Reveal the Final Challenge! ✨
                                </Button>
                            </div>
                        ) : (
                           <>
                               <p className="text-slate-600 mb-6">Jokes aside, you took a step forward. That's wonderful.</p>
                               <div className="flex flex-col sm:flex-row justify-center gap-3">
                                   <Button onClick={handleNewGoal} variant="secondary">Try another one?</Button>
                                   <Button onClick={handleReset} variant="ghost">I'm done for now</Button>
                               </div>
                           </>
                        )}
                    </Card>
                );
            case 'completed-ultimate':
                 return (
                    <Card className="text-center bg-gradient-to-br from-yellow-100 to-amber-200">
                        <div className="text-4xl mb-4">🏆✨🎉</div>
                        <h2 className="text-3xl font-bold text-amber-800 mb-4" lang="ml">{completionMessage}</h2>
                        <p className="text-amber-700 mb-6">Truly legendary! A new journey awaits.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <Button onClick={handleReset} variant="primary">Start a New Streak</Button>
                        </div>
                    </Card>
                );
        }
    };

    return (
        <div className="min-h-full flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {status !== 'initial' && <ProgressBar count={completionCount} />}
                {renderContent()}
            </div>
        </div>
    );
};

export default HomePage;