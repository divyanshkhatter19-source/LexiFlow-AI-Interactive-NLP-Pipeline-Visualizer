// src/hooks/usePipeline.ts
import React, { createContext, useContext, useState, ReactNode } from "react";
import { VocabularyEntry, TokenInfo } from "../types";
import { buildVocabulary } from "../algorithms/vocabulary";
import { wordTokenize, lookupTokens } from "../algorithms/tokenizer";
import { applyBPE } from "../algorithms/bpe";

interface PipelineContextProps {
  vocabMap: Map<string, VocabularyEntry>;
  setVocabRaw: (raw: string) => void;
  vocabArray: VocabularyEntry[];
  sentence: string;
  setSentence: (s: string) => void;
  wordTokens: string[];
  tokenInfos: TokenInfo[]; // after vocab lookup
  subwordTokens: TokenInfo[]; // after BPE
  initializePipeline: () => void;
  selectedToken: TokenInfo | null;
  setSelectedToken: (t: TokenInfo | null) => void;
}

const PipelineContext = createContext<PipelineContextProps | undefined>(undefined);

export const PipelineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ----- State -----
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null);
  const [vocabMap, setVocabMap] = useState<Map<string, VocabularyEntry>>(new Map());
  const [vocabArray, setVocabArray] = useState<VocabularyEntry[]>([]);
  const [sentence, setSentence] = useState<string>("");
  const [wordTokens, setWordTokens] = useState<string[]>([]);
  const [tokenInfos, setTokenInfos] = useState<TokenInfo[]>([]);
  const [subwordTokens, setSubwordTokens] = useState<TokenInfo[]>([]);

  // ----- Helpers -----
  const setVocabRaw = (raw: string) => {
    const map = buildVocabulary(raw);
    setVocabMap(map);
    setVocabArray(Array.from(map.values()).sort((a, b) => a.id - b.id));
  };

  const initializePipeline = () => {
    const words = wordTokenize(sentence);
    setWordTokens(words);
    const lookup = lookupTokens(words, vocabMap);
    setTokenInfos(lookup);
    const subTokens = applyBPE(words, vocabMap);
    setSubwordTokens(subTokens);
  };

  // ----- Context value -----
  const contextValue: PipelineContextProps = {
    vocabMap,
    setVocabRaw,
    vocabArray,
    sentence,
    setSentence,
    wordTokens,
    tokenInfos,
    subwordTokens,
    initializePipeline,
    selectedToken,
    setSelectedToken,
  };

  return (
    <PipelineContext.Provider value={contextValue}>
      {children}
    </PipelineContext.Provider>
  );
};

export const usePipeline = () => {
  const ctx = useContext(PipelineContext);
  if (!ctx) {
    throw new Error("usePipeline must be used within a PipelineProvider");
  }
  return ctx;
};
