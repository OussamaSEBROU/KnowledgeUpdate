import React, { useState } from 'react';
import { Axiom, ChatMessage, Language, ViewMode } from './types.ts';
import { gemini } from './geminiService.ts';
import Flashcard from './components/Flashcard.tsx';
import ChatInterface from './components/ChatInterface.tsx';
import Sidebar from './components/Sidebar.tsx';

const App: React.FC = () => {
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [axioms, setAxioms] = useState<Axiom[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<'idle' | 'reading' | 'analyzing' | 'ready'>('idle');
  const [language, setLanguage] = useState<Language>('en');
  const [viewMode, setViewMode] = useState<ViewMode>('sanctuary');

  const PERSISTENT_TITLE = "KNOWLEDGE AI";
  const PERSISTENT_TAGLINE = "\"A high-performance research sanctuary for axiomatic wisdom.\"";

  const t = {
    en: {
      title: PERSISTENT_TITLE,
      subtitle: "An extension of the 5minute Paper project",
      tagline: PERSISTENT_TAGLINE,
      upload: "Upload your Book / File",
      uploadDesc: "Transmit your document into the core for intellectual synthesis.",
      disclaimerTitle: "THE RESEARCHER'S PROTOCOL",
      disclaimerBody: "This sanctuary is designed to organize, synthesize, and facilitate deep brainstorming. However, it is NOT a replacement for direct reading. To capture the true essence and soul of the wisdom, the researcher must engage with the original text directly. Use this tool to sharpen your insights, not to bypass the fundamental act of study.",
      initializing: "Initializing Neural Link...",
      synthesizing: "Analyzing Authorial DNA...",
      decoding: "Decoding philosophical intent and linguistic structure.",
      axioms: "Knowledge Axioms",
      from: "Stylistic extractions from:",
      chatTitle: "Engage Sanctuary Dialogue",
      chatDesc: "Deep interrogation of the document's metaphysical structure.",
      footer: "AESTHETIC INTELLECTUAL SANCTUARY"
    },
    ar: {
      title: PERSISTENT_TITLE,
      subtitle: "امتداد لمشروع 5minute Paper",
      tagline: PERSISTENT_TAGLINE,
      upload: "رفع الكتاب / الملف",
      uploadDesc: "أرسل وثيقتك إلى النواة من أجل التوليف الفكري العميق.",
      disclaimerTitle: "بروتوكول الباحث الفكري",
      disclaimerBody: "صُمم هذا الملاذ لتنظيم الأفكار وتسهيل العصف الذهني المعمق، لكنه ليس بديلاً عن القراءة المباشرة بأي حال من الأحوال. لاستيعاب جوهر الحكمة وروح النص، يجب على الباحث المطالعة المباشرة للملف. استخدم هذه الأداة لشحذ رؤيتك وتسهيل الوصول للمحتوى، لا لتجاوز فعل القراءة الجوهري.",
      initializing: "جارٍ تهيئة الارتباط العصبي...",
      synthesizing: "تحليل البنية البيانية للكاتب...",
      decoding: "فك رموز القصد الفلسفي والنسق اللغوي.",
      axioms: "البديهيات المعرفية",
      from: "استخلاصات بيانية من:",
      chatTitle: "حوار الملاذ الفكري",
      chatDesc: "استجواب عميق للبنية الميتافيزيقية للوثيقة.",
      footer: "الملاذ الفكري الجمالي"
    }
  }[language];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') return;

    setFileName(file.name);
    setStatus('reading');
    setViewMode('sanctuary');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      const base64String = result.split(',')[1];
      if (base64String) {
        setPdfBase64(base64String);
        await processAxioms(base64String, language);
      }
    };
    reader.readAsDataURL(file);
  };

  const processAxioms = async (base64: string, lang: Language) => {
    setStatus('analyzing');
    try {
      const extracted = await gemini.extractAxioms(base64, lang);
      setAxioms(extracted);
      setStatus('ready');
    } catch (error) {
      console.error("Extraction failed:", error);
      setStatus('idle');
    }
  };

  const reset = () => {
    setPdfBase64(null);
    setFileName(null);
    setAxioms([]);
    setChatHistory([]);
    setStatus('idle');
    setViewMode('sanctuary');
  };

  return (
    <div className={`min-h-screen bg-[#0a0f1d] text-slate-200 selection:bg-indigo-500/30 flex ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Sidebar 
        language={language} 
        setLanguage={setLanguage} 
        resetApp={reset} 
        viewMode={viewMode} 
        setViewMode={setViewMode}
        hasFile={!!pdfBase64}
      />

      <main className="flex-1 transition-all duration-300">
        <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 max-w-7xl flex flex-col min-h-screen">
          <div className="flex-grow">
            {/* Header */}
            {viewMode === 'sanctuary' && (
              <header className="text-center mb-12 space-y-4 animate-in fade-in duration-700">
                <div className="flex flex-col items-center">
                  <span className={`text-sm md:text-base tracking-[0.2em] text-indigo-400 font-bold uppercase mb-2 opacity-90 ${language === 'ar' ? 'font-sans-ar' : 'font-main'}`}>
                    {t.subtitle}
                  </span>
                  <div className="inline-block relative">
                    <h1 className="font-academic text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-indigo-300 tracking-tight">
                      {t.title}
                    </h1>
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent mt-3"></div>
                  </div>
                </div>
                <p className="font-academic italic text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto pt-4">
                  {t.tagline}
                </p>
              </header>
            )}

            {/* Disclaimer Banner - Always visible when file not ready or just uploaded */}
            {status !== 'ready' && viewMode === 'sanctuary' && (
              <div className="max-w-4xl mx-auto mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
                <div className="glass-panel border-indigo-500/20 p-8 rounded-3xl relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/40"></div>
                  <h4 className="text-indigo-400 font-bold tracking-[0.2em] text-xs mb-4 uppercase flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                    {t.disclaimerTitle}
                  </h4>
                  <p className={`italic text-lg text-slate-300 leading-relaxed ${language === 'ar' ? 'font-sans-ar' : 'font-academic'}`}>
                    {t.disclaimerBody}
                  </p>
                </div>
              </div>
            )}

            {status === 'idle' && (
              <div className="max-w-2xl mx-auto">
                <label className="group block glass-panel border-dashed border-2 border-indigo-500/30 hover:border-indigo-500/60 p-12 md:p-20 rounded-[2.5rem] cursor-pointer transition-all duration-500 text-center glow-indigo transform hover:-translate-y-2">
                  <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
                  <div className="space-y-6">
                    <div className="w-24 h-24 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-500">
                      <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h3 className={`text-3xl font-bold ${language === 'ar' ? 'font-sans-ar' : 'font-academic'}`}>{t.upload}</h3>
                      <p className={`text-slate-500 max-w-sm mx-auto ${language === 'ar' ? 'font-sans-ar' : 'font-main'}`}>{t.uploadDesc}</p>
                    </div>
                  </div>
                </label>
              </div>
            )}

            {(status === 'reading' || status === 'analyzing') && (
              <div className="max-w-md mx-auto text-center py-20">
                <div className="relative mb-8">
                  <div className="w-24 h-24 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin mx-auto"></div>
                </div>
                <h2 className={`text-2xl font-bold mb-2 animate-pulse text-indigo-300 ${language === 'ar' ? 'font-sans-ar' : 'font-academic'}`}>
                  {status === 'reading' ? t.initializing : t.synthesizing}
                </h2>
                <p className={`text-slate-500 italic ${language === 'ar' ? 'font-sans-ar' : 'font-main'}`}>{t.decoding}</p>
              </div>
            )}

            {status === 'ready' && viewMode === 'sanctuary' && (
              <div className="space-y-24 animate-in fade-in slide-in-from-bottom-10 duration-700">
                {/* Axioms Section */}
                <section className="space-y-12">
                  <div className={`space-y-2 border-indigo-500 pl-6 ${language === 'ar' ? 'border-r-4 pr-6 pl-0' : 'border-l-4'}`}>
                    <h2 className={`text-5xl font-bold text-white tracking-tight ${language === 'ar' ? 'font-sans-ar' : 'font-academic'}`}>{t.axioms}</h2>
                    <p className={`text-slate-400 italic text-lg ${language === 'ar' ? 'font-sans-ar' : 'font-main'}`}>{t.from} {fileName}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {axioms.map((axiom, idx) => (
                      <Flashcard key={idx} axiom={axiom} index={idx} />
                    ))}
                  </div>
                </section>

                {/* Chat Section */}
                <section className="space-y-10 pb-20">
                  {pdfBase64 && (
                    <ChatInterface 
                      pdfBase64={pdfBase64} 
                      chatHistory={chatHistory} 
                      setChatHistory={setChatHistory} 
                    />
                  )}
                </section>
              </div>
            )}

            {status === 'ready' && viewMode === 'document' && pdfBase64 && (
              <div className="h-[80vh] w-full glass-panel rounded-3xl overflow-hidden border-emerald-500/20 shadow-2xl animate-in zoom-in-95 duration-500">
                <iframe
                  src={`data:application/pdf;base64,${pdfBase64}#toolbar=0`}
                  className="w-full h-full border-none"
                  title="Document Viewer"
                />
              </div>
            )}
          </div>

          {/* Footer Decoration */}
          <footer className="mt-32 pb-12 text-center">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-10 opacity-30"></div>
            <div className="flex flex-col items-center gap-4">
              <p className="text-[10px] tracking-[0.5em] text-slate-600 uppercase font-bold font-main">
                {PERSISTENT_TITLE} &bull; {t.footer}
              </p>
              <p className="text-slate-400 font-main text-sm tracking-[0.2em] font-medium opacity-80">
                Developed by <span className="text-indigo-400 font-bold">Oussama SEBROU</span>
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;