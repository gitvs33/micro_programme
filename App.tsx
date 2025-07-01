import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import BottomNav from './components/layout/BottomNav';
import HomePage from './pages/HomePage';
import ChillModePage from './pages/ChillModePage';
import AnalysisPage from './pages/AnalysisPage';

console.log('VITE_API_KEY from import.meta.env:', import.meta.env.VITE_API_KEY);

function App(): React.ReactNode {
  return (
    <HashRouter>
      <div className="flex flex-col h-screen font-sans bg-slate-50 text-slate-800">
        <main className="flex-grow overflow-y-auto pb-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chill" element={<ChillModePage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </HashRouter>
  );
}

export default App;
