// src/types/index.ts
export interface VocabularyEntry {
  id: number;
  token: string;
  frequency: number;
}

export interface TokenInfo {
  text: string; // original token text (word or subword)
  type: 'word' | 'subword' | 'unk';
  id: number; // numerical ID (from vocab or generated)
  originalWord: string; // the word from which this token originated (for subwords)
  position: number; // index in the original sentence (starting at 0)
}
