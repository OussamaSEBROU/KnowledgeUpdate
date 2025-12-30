import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types.ts';
import { gemini } from '../geminiService.ts';

interface ChatInterfaceProps {
  pdfBase64: string;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ pdfBase64, chatHistory, setChatHistory }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await gemini.chat(pdfBase64, chatHistory, userMessage);
      setChatHistory(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { role: 'model', text: "Forgive me, my intellectual circuits are momentarily clouded. Please rephrase." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto w-full min-h-[600px] relative">
      {/* Message History */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto pb-48 space-y-12 px-2 md:px-6 scroll-smooth"
      >
        {chatHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20 opacity-40">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="font-academic italic text-2xl text-slate-300 max-w-sm">"The beginning of wisdom is the definition of terms."</p>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] font-bold text-slate-500">Dialogue Sanctuary Ready</p>
          </div>
        )}

        {chatHistory.map((msg, idx) => {
          const isArabic = msg.text.match(/[\u0600-\u06FF]/);
          return (
            <div 
              key={idx} 
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
            >
              <div className={`flex items-start gap-4 max-w-[95%] md:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar Icon */}
                <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center mt-1 shadow-md border ${
                  msg.role === 'user' ? 'bg-indigo-600 border-indigo-400/30' : 'bg-slate-800 border-white/10'
                }`}>
                  {msg.role === 'user' ? (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  ) : (
                    <span className="text-[10px] font-bold text-indigo-400 font-academic tracking-tighter">AI</span>
                  )}
                </div>

                {/* Message Content */}
                <div className={`group relative p-5 md:p-6 rounded-3xl ${
                  msg.role === 'user' 
                    ? 'bg-slate-800/90 text-slate-100 rounded-tr-none border border-white/5' 
                    : 'text-slate-200 font-main leading-relaxed'
                }`}>
                  <p className={`text-base md:text-[17px] whitespace-pre-wrap ${isArabic ? 'text-right font-sans-ar leading-[1.8]' : 'text-left font-main'}`}>
                    {msg.text}
                  </p>
                  
                  {/* Subtle meta info */}
                  {msg.role === 'model' && (
                    <div className="mt-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-[10px] uppercase tracking-widest text-slate-500 hover:text-indigo-400 font-bold transition-colors">Copy Wisdom</button>
                      <button className="text-[10px] uppercase tracking-widest text-slate-500 hover:text-indigo-400 font-bold transition-colors">Refine Link</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-4 animate-in fade-in duration-300">
             <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/10 shrink-0 flex items-center justify-center mt-1">
                <span className="text-[10px] font-bold text-indigo-400 font-academic tracking-tighter">AI</span>
             </div>
             <div className="p-4 flex gap-1.5 mt-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
             </div>
          </div>
        )}
      </div>

      {/* Input Sanctuary - Styled like ChatGPT/Gemini floating input */}
      <div className="fixed bottom-12 left-0 right-0 z-40 px-4 pointer-events-none">
        <div className="max-w-3xl mx-auto w-full pointer-events-auto">
          <form 
            onSubmit={handleSend}
            className="relative flex items-end bg-slate-900/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl transition-all focus-within:border-indigo-500/50 p-2 pl-7 group overflow-hidden"
          >
            <textarea
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Interrogate the core wisdom..."
              className="flex-1 bg-transparent border-none py-5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-0 text-lg resize-none max-h-[200px] font-main"
            />
            <div className="pb-2 pr-2">
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-12 h-12 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-full transition-all active:scale-90 shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
          <p className="text-center text-[10px] text-slate-600 mt-4 uppercase tracking-[0.2em] font-bold">
            Knowledge AI may generate profound scholarly hallucinations. Verify the Axioms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;