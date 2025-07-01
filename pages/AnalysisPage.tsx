import React, { useState, useCallback } from 'react';
import { fetchAnalysisQuestions, fetchAnalysisFeedback } from '../services/geminiService';
import { AnalysisQuestion, AnalysisFeedback } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ICONS } from '../constants';

type Status = 'idle' | 'loading-questions' | 'answering' | 'loading-feedback' | 'showing-feedback' | 'error';

const AnalysisPage = (): React.ReactNode => {
    const [status, setStatus] = useState<Status>('idle');
    const [questions, setQuestions] = useState<AnalysisQuestion[]>([]);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [feedback, setFeedback] = useState<AnalysisFeedback | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleStart = useCallback(async () => {
        setStatus('loading-questions');
        setError(null);
        try {
            const fetchedQuestions = await fetchAnalysisQuestions();
            setQuestions(fetchedQuestions);
            setAnswers({});
            setFeedback(null);
            setStatus('answering');
        } catch (err) {
            console.error(err);
            setError('Could not generate questions. Maybe the universe wants you to just chill for a bit?');
            setStatus('error');
        }
    }, []);

    const handleSubmit = useCallback(async () => {
        setStatus('loading-feedback');
        setError(null);
        const submission = questions.reduce((acc, question, index) => {
            acc[question.question] = answers[index];
            return acc;
        }, {} as { [key: string]: string });

        try {
            const fetchedFeedback = await fetchAnalysisFeedback(submission);
            setFeedback(fetchedFeedback);
            setStatus('showing-feedback');
        } catch (err) {
            console.error(err);
            setError('The AI is contemplating your answers too deeply. Please try again.');
            setStatus('error');
        }
    }, [questions, answers]);

    const handleAnswerChange = (questionIndex: number, option: string) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: option }));
    };

    const handleReset = () => {
        setStatus('idle');
        setQuestions([]);
        setAnswers({});
        setFeedback(null);
        setError(null);
    };

    const areAllQuestionsAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

    const renderContent = () => {
        switch (status) {
            case 'idle':
                return (
                    <Card className="text-center">
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Quick Self-Analysis</h1>
                        <p className="text-slate-600 mb-6">Get a unique set of questions from our friendly AI to see what's on your mind. It's fast, fun, and just for you.</p>
                        <Button onClick={handleStart} size="lg">Start Quick Analysis ✨</Button>
                    </Card>
                );

            case 'loading-questions':
            case 'loading-feedback':
                return (
                     <Card className="text-center">
                        <div className="flex flex-col items-center justify-center min-h-[15rem]">
                            <ICONS.Loader className="w-12 h-12 text-indigo-500 animate-spin" />
                            <p className="text-slate-600 mt-4">
                                {status === 'loading-questions' ? 'Crafting some unique questions for you...' : 'Analyzing your profound answers...'}
                            </p>
                        </div>
                    </Card>
                );

            case 'answering':
                return (
                    <Card>
                        <h1 className="text-2xl font-bold text-slate-800 mb-4 text-center">Your Questions</h1>
                        <div className="space-y-6">
                            {questions.map((q, qIndex) => (
                                <div key={qIndex}>
                                    <p className="font-semibold text-slate-700 mb-3">{qIndex + 1}. {q.question}</p>
                                    <fieldset className="space-y-2">
                                        <legend className="sr-only">Options for: {q.question}</legend>
                                        {q.options.map((option, oIndex) => (
                                            <label key={oIndex} htmlFor={`q${qIndex}o${oIndex}`} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${answers[qIndex] === option ? 'bg-indigo-100 border-indigo-500 ring-2 ring-indigo-300' : 'bg-white hover:bg-slate-50 border-slate-200'}`}>
                                                <input
                                                    type="radio"
                                                    id={`q${qIndex}o${oIndex}`}
                                                    name={`question-${qIndex}`}
                                                    value={option}
                                                    checked={answers[qIndex] === option}
                                                    onChange={() => handleAnswerChange(qIndex, option)}
                                                    className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                                                />
                                                <span className="ml-3 text-sm font-medium text-slate-700">{option}</span>
                                            </label>
                                        ))}
                                    </fieldset>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 text-center">
                            <Button onClick={handleSubmit} size="lg" disabled={!areAllQuestionsAnswered}>
                                Get My Feedback
                            </Button>
                        </div>
                    </Card>
                );

            case 'showing-feedback':
                if (!feedback) return null;
                return (
                     <div>
                        <Card className="mb-4 bg-gradient-to-br from-purple-50 to-indigo-50">
                            <h2 className="text-sm font-bold text-purple-700 mb-2 text-center uppercase tracking-wider">A Friendly Roast</h2>
                            <p className="text-center text-xl font-medium text-slate-800" lang="ml">{feedback.humorous}</p>
                        </Card>
                        <Card>
                            <h2 className="text-sm font-bold text-green-700 mb-2 text-center uppercase tracking-wider">A Gentle Nudge</h2>
                            <p className="text-center text-lg text-slate-700">{feedback.serious}</p>
                        </Card>
                         <div className="mt-6 text-center">
                            <Button onClick={handleReset} variant="secondary">Start Over</Button>
                        </div>
                    </div>
                );

            case 'error':
                 return (
                    <Card className="text-center">
                        <h2 className="text-xl font-bold text-red-600 mb-4">Oops!</h2>
                        <p className="text-slate-600 mb-6">{error}</p>
                        <Button onClick={handleReset}>Try Again</Button>
                    </Card>
                );
        }
    };

    return (
        <div className="min-h-full flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {renderContent()}
            </div>
        </div>
    );
};

export default AnalysisPage;
