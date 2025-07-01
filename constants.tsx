import React from 'react';
import { MicroGoal, GoalCategory } from './types';

export const ICONS = {
    Home: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
    ),
    Sparkles: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9 1.9 5.8 1.9-5.8 5.8-1.9-5.8-1.9Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
    ),
    Book: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
    ),
    Crown: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M5 20h14"/></svg>
    ),
    Loader: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
    ),
    BookOpen: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
    ),
    ClipboardList: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
    ),
};

export const MICRO_GOALS: MicroGoal[] = [
    { id: 1, text: 'Open a book to a random page', category: GoalCategory.Reading },
    { id: 2, text: 'Read just one sentence', category: GoalCategory.Reading },
    { id: 3, text: 'Look at the cover of a book', category: GoalCategory.Reading },
    { id: 4, text: 'Stand up and stretch for 10 seconds', category: GoalCategory.Movement },
    { id: 5, text: 'Walk to the window and look outside', category: GoalCategory.Movement },
    { id: 6, text: 'Do one gentle neck roll', category: GoalCategory.Movement },
    { id: 7, text: 'Drink a small glass of water', category: GoalCategory.SelfCare },
    { id: 8, text: 'Take one deep, slow breath', category: GoalCategory.SelfCare },
    { id: 9, text: 'Splash your face with cool water', category: GoalCategory.SelfCare },
    { id: 10, text: 'Think of one thing you\'re grateful for', category: GoalCategory.Engagement },
    { id: 11, text: 'Send a single heart emoji to a friend', category: GoalCategory.Engagement },
];

export const CATEGORY_STYLES: { [key in GoalCategory]: { color: string; icon: React.ReactNode } } = {
    [GoalCategory.Reading]: { color: 'bg-blue-100 text-blue-800', icon: <ICONS.Book className="w-5 h-5" /> },
    [GoalCategory.Movement]: { color: 'bg-green-100 text-green-800', icon: '🏃' },
    [GoalCategory.SelfCare]: { color: 'bg-purple-100 text-purple-800', icon: '💖' },
    [GoalCategory.Engagement]: { color: 'bg-yellow-100 text-yellow-800', icon: '😊' },
    [GoalCategory.Ultimate]: { color: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-md', icon: <ICONS.Crown className="w-5 h-5" /> },
};
