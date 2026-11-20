// src/algorithms/bpe.ts
import { VocabularyEntry, TokenInfo } from "../types";

/**
 * Simple deterministic BPE-like subword tokenizer.
 * For each token that is unknown in the vocab, it greedily matches the longest prefix
 * that exists in the vocab (or previously generated subword vocab). If no prefix matches,
 * it falls back to a single character.
 * New subword entries receive incremental IDs after the existing vocab IDs.
 */
export function applyBPE(tokens: string[], vocab: Map<string, VocabularyEntry>): TokenInfo[] {
  const result: TokenInfo[] = [];
  // Clone vocab so we can add subwords on the fly
  const subVocab = new Map<string, VocabularyEntry>(vocab);
  let nextId = Math.max(0, ...Array.from(vocab.values()).map((e) => e.id)) + 1;

  const addSubword = (sub: string): VocabularyEntry => {
    const existing = subVocab.get(sub);
    if (existing) return existing;
    const entry: VocabularyEntry = { id: nextId++, token: sub, frequency: 0 };
    subVocab.set(sub, entry);
    return entry;
  };

  tokens.forEach((orig, idx) => {
    const clean = orig.toLowerCase();
    const entry = vocab.get(clean);
    if (entry) {
      // Known word – keep as is
      result.push({
        text: orig,
        type: "word",
        id: entry.id,
        originalWord: orig,
        position: idx,
      });
      return;
    }
    // Unknown – perform greedy split
    let remaining = clean;
    const subTokens: TokenInfo[] = [];
    while (remaining.length > 0) {
      // Find longest prefix in subVocab
      let match = "";
      for (let i = remaining.length; i > 0; i--) {
        const prefix = remaining.slice(0, i);
        if (subVocab.has(prefix)) {
          match = prefix;
          break;
        }
      }
      if (!match) {
        // No prefix – take first character
        match = remaining[0];
      }
      const subEntry = addSubword(match);
      subTokens.push({
        text: match,
        type: subEntry.id < (vocab.size + 1) ? "subword" : "subword",
        id: subEntry.id,
        originalWord: orig,
        position: idx,
      });
      remaining = remaining.slice(match.length);
    }
    result.push(...subTokens);
  });

  return result;
}
