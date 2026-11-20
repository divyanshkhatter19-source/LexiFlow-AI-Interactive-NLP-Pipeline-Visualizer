// src/algorithms/tokenizer.ts
import { VocabularyEntry } from "../types";
import { TokenInfo } from "../types";

/**
 * Simple word tokenizer – splits on whitespace and punctuation, keeps punctuation as separate tokens.
 */
export function wordTokenize(sentence: string): string[] {
  // Keep punctuation as separate tokens
  const tokens = sentence
    .trim()
    .split(/([\s,.!?;:()\[\]{}]+|\b)/)
    .filter((t) => t && t.trim().length > 0);
  return tokens;
}

/**
 * Lookup tokens in the vocabulary map and assign IDs.
 */
export function lookupTokens(
  tokens: string[],
  vocab: Map<string, VocabularyEntry>
): TokenInfo[] {
  const result: TokenInfo[] = [];
  tokens.forEach((t, idx) => {
    const clean = t.toLowerCase();
    const entry = vocab.get(clean);
    if (entry) {
      result.push({
        text: t,
        type: "word",
        id: entry.id,
        originalWord: t,
        position: idx,
      });
    } else {
      result.push({
        text: t,
        type: "unk",
        id: -1,
        originalWord: t,
        position: idx,
      });
    }
  });
  return result;
}
