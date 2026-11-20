// src/algorithms/vocabulary.ts
import { VocabularyEntry } from "../types";

/**
 * Build a vocabulary from raw text (multiple lines). Returns a map from token to entry.
 * Assigns incremental numeric IDs starting from 1.
 */
export function buildVocabulary(raw: string): Map<string, VocabularyEntry> {
  const tokenMap = new Map<string, VocabularyEntry>();
  const tokens = raw
    .split(/\s+/)
    .filter((t) => t.length > 0)
    .map((t) => t.trim().toLowerCase());
  let nextId = 1;
  for (const token of tokens) {
    const existing = tokenMap.get(token);
    if (existing) {
      existing.frequency++;
    } else {
      tokenMap.set(token, { id: nextId++, token, frequency: 1 });
    }
  }
  return tokenMap;
}

/**
 * Convert a vocabulary map to an array suitable for rendering a table.
 */
export function vocabMapToArray(vocab: Map<string, VocabularyEntry>): VocabularyEntry[] {
  return Array.from(vocab.values()).sort((a, b) => a.id - b.id);
}
