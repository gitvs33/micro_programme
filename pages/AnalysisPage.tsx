import React, { useState, useCallback } from 'react';
import { fetchAnalysisQuestions, fetchAnalysisFeedback } from '../services/geminiService';
import { AnalysisQuestion, AnalysisFeedback } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ICONS } from '../constants';
import useLocalStorage from '../hooks/useLocalStorage';

type Status = 'idle' | 'loading-questions' | 'answering' | 'loading-feedback' | 'showing-feedback' | 'error';

const AnalysisPage = (): React.ReactNode => {
    const [status, setStatus] = useLocalStorage<Status>('analysis-status', 'idle');
    const [questions, setQuestions] = useLocalStorage<AnalysisQuestion[]>('analysis-questions', []);
    const [answers, setAnswers] = useLocalStorage<{ [key: number]: string }>('analysis-answers', {});
    const [feedback, setFeedback] = useLocalStorage<AnalysisFeedback | null>('analysis-feedback', null);
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
        const submission = questions.reduce((acc: { [key: string]: string }, question: AnalysisQuestion, index: number) => {
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
        setAnswers((prev: { [key: number]: string }) => ({ ...prev, [questionIndex]: option }));
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
                            {questions.map((q: AnalysisQuestion, qIndex: number) => (
                                <div key={qIndex}>
                                    <p className="font-semibold text-slate-700 mb-3">{qIndex + 1}. {q.question}</p>
                                    <fieldset className="space-y-2">
                                        <legend className="sr-only">Options for: {q.question}</legend>
                                        {q.options.map((option: string, oIndex: number) => (
                                            <label key={oIndex} htmlFor={`q${qIndex}o${oIndex}`} className={`