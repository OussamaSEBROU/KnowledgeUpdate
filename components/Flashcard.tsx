
import React, { useState } from 'react';
import { Axiom } from '../types';

interface FlashcardProps {
  axiom: Axiom;
  index: number;
}

const Flashcard: React.FC<FlashcardProps> = ({ axiom, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const isArabic = axiom.term.match(/[\u0600-\u06FF]/) || axiom.definition.match(/[\u0600-\u06FF]/);

  return (
    <div 
      className="group perspective-1000 w-full h-72 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full duration-1000 preserve-3d shadow-2xl rounded-[2rem] transition-transform ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        {/* Front */}
        <div className="absolute inset-0 backface-hidden glass-panel rounded-[2rem] flex flex-col items-center justify-center p-8 text-center border-indigo-500/20 group-hover:border-indigo-500/50 transition-all overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"></div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-indigo-400 mb-4 font-bold opacity-60">Axiomatic Concept 0{index + 1}</span>
          <h3 className={`text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-lg ${isArabic ? 'font-sans-ar' : 'font-academic'}`}>
            {axiom.term}
          </h3>
          <div className="mt-8 flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40"></div>
            <div className="w-8 h-1.5 rounded-full bg-indigo-500/20 group-hover:bg-indigo-500/40 transition-colors"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40"></div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] bg-slate-900/90 backdrop-blur-3xl rounded-[2rem] flex items-center justify-center p-10 text-center border border-indigo-500/30 overflow-y-auto">
          <p className={`text-lg italic text-slate-200 leading-relaxed tracking-wide ${isArabic ? 'font-sans-ar text-right' : 'font-academic'}`}>
            "{axiom.definition}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
