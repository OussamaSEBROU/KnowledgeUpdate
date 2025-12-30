
export type Language = 'en' | 'ar';
export type ViewMode = 'sanctuary' | 'document';

export interface Axiom {
  term: string;
  definition: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface AppState {
  pdfBase64: string | null;
  fileName: string | null;
  axioms: Axiom[];
  chatHistory: ChatMessage[];
  status: 'idle' | 'reading' | 'analyzing' | 'ready';
  language: Language;
  viewMode: ViewMode;
}
