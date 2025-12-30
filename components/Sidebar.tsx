import React, { useState } from 'react';
import { Language, ViewMode } from '../types.ts';

interface SidebarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  resetApp: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  hasFile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ language, setLanguage, resetApp, viewMode, setViewMode, hasFile }) => {
  const [activePanel, setActivePanel] = useState<'none' | 'about' | 'help'>('none');

  const content = {
    en: {
      about: "Knowledge AI is an elite research sanctuary designed by Oussama SEBROU. It facilitates the deep extraction of axiomatic wisdom from dense academic texts, allowing researchers to interface directly with complex knowledge structures.",
      help: "1. Upload your primary text.\n2. Review the synthesized Axioms.\n3. Engage in the dialogue sanctuary for profound interrogation of the content.",
      aboutTitle: "About the Sanctuary",
      helpTitle: "Researcher's Guide",
      viewDoc: "View Document",
      sanctuary: "Research Sanctuary",
      reset: "New Session"
    },
    ar: {
      about: "Knowledge AI هو ملاذ بحثي متميز صممه أسامة صبره. يعمل على تسهيل الاستخراج العميق للحكمة البديهية من النصوص الأكاديمية المعقدة، مما يسمح للباحثين بالتفاعل مباشرة مع هياكل المعرفة العميقة.",
      help: "١. قم بتحميل النص الأساسي الخاص بك.\n٢. راجع البديهيات المستخلصة.\n٣. انخرط في حوار الملاذ لاستجواب محتوى النص بشكل عميق.",
      aboutTitle: "حول الملاذ",
      helpTitle: "دليل الباحث",
      viewDoc: "عرض المستند",
      sanctuary: "ملاذ البحث",
      reset: "جلسة جديدة"
    }
  };

  const t = content[language];

  return (
    <aside className={`fixed top-0 bottom-0 z-50 w-20 hover:w-64 transition-all duration-300 glass-panel border-r border-white/10 group flex flex-col items-center py-8 gap-10 ${language === 'ar' ? 'right-0 border-l' : 'left-0 border-r'}`}>
      {/* Brand Icon */}
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
        <span className="font-academic text-2xl font-bold text-white">K</span>
      </div>

      <nav className="flex-1 w-full px-4 space-y-4">
        {/* Reset Button */}
        <button onClick={resetApp} className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all overflow-hidden whitespace-nowrap">
          <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity font-medium font-sans">{t.reset}</span>
        </button>

        {/* View Document Toggle - Only visible if file is uploaded */}
        {hasFile && (
          <button 
            onClick={() => setViewMode(viewMode === 'sanctuary' ? 'document' : 'sanctuary')} 
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all overflow-hidden whitespace-nowrap ${viewMode === 'document' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            {viewMode === 'sanctuary' ? (
              <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            ) : (
              <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            )}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity font-medium font-sans">
              {viewMode === 'sanctuary' ? t.viewDoc : t.sanctuary}
            </span>
          </button>
        )}

        {/* About Trigger */}
        <button onClick={() => setActivePanel(activePanel === 'about' ? 'none' : 'about')} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all overflow-hidden whitespace-nowrap ${activePanel === 'about' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
          <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity font-medium font-sans">{t.aboutTitle}</span>
        </button>

        {/* Help Trigger */}
        <button onClick={() => setActivePanel(activePanel === 'help' ? 'none' : 'help')} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all overflow-hidden whitespace-nowrap ${activePanel === 'help' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
          <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity font-medium font-sans">{t.helpTitle}</span>
        </button>
      </nav>

      {/* Language Toggle */}
      <div className="w-full px-4 mb-4">
        <div className="p-1 glass-panel rounded-xl flex group-hover:flex-row flex-col gap-1">
          <button onClick={() => setLanguage('en')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${language === 'en' ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}>EN</button>
          <button onClick={() => setLanguage('ar')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${language === 'ar' ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}>AR</button>
        </div>
      </div>

      {/* Info Flyouts */}
      {activePanel !== 'none' && (
        <div className={`fixed bottom-8 ${language === 'ar' ? 'right-72' : 'left-72'} w-80 glass-panel rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-left-4 duration-300`}>
          <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
            <h4 className="font-academic font-bold text-indigo-400">{activePanel === 'about' ? t.aboutTitle : t.helpTitle}</h4>
            <button onClick={() => setActivePanel('none')} className="text-slate-500 hover:text-white"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <p className={`text-sm leading-relaxed text-slate-300 font-sans ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            {activePanel === 'about' ? t.about : t.help}
          </p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;