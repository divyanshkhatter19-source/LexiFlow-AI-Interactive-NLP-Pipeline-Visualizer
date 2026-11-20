// src/components/VocabularyBuilder.tsx
import React, { useState, useRef, useEffect } from "react";
import { usePipeline } from "../hooks/usePipeline";
import { VocabularyEntry } from "../types";
import { Upload, Play } from "lucide-react";

const demoSentences = [
  "Artificial intelligence is transforming the world.",
  "Machine learning helps computers recognize patterns.",
  "Natural language processing enables machines to understand text.",
  "Deep learning uses neural networks to learn complex representations.",
  "A transformer model processes language using attention mechanisms.",
  "Data drives modern AI research and applications.",
];

const VocabularyBuilder: React.FC = () => {
  const { setVocabRaw, vocabArray, initializePipeline, setSentence } = usePipeline();
  const [rawInput, setRawInput] = useState<string>("");
  const [wordCount, setWordCount] = useState<number>(0);
  const [uniqueCount, setUniqueCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const words = rawInput
      .split(/\s+/)
      .filter((w) => w.trim().length > 0);
    setWordCount(words.length);
    const uniq = new Set(words.map((w) => w.toLowerCase()));
    setUniqueCount(uniq.size);
  }, [rawInput]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setRawInput((prev) => (prev ? prev + "\n" + text : text));
    };
    reader.readAsText(file);
  };

  const loadDemo = () => {
    const demoText = demoSentences.join(" \n");
    setRawInput(demoText);
    setVocabRaw(demoText);
    // set a default sentence for stage two
    setSentence(demoSentences[0]);
    initializePipeline();
  };

  const handleInitialize = () => {
    if (!rawInput.trim()) return;
    setVocabRaw(rawInput);
    // keep any existing sentence (or empty)
    initializePipeline();
  };

  const renderTable = () => {
    if (vocabArray.length === 0) return null;
    return (
      <table className="w-full text-sm mt-4 border border-gray-700 rounded">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-2 py-1">Token</th>
            <th className="px-2 py-1">Token ID</th>
            <th className="px-2 py-1">Frequency</th>
          </tr>
        </thead>
        <tbody>
          {vocabArray.map((e) => (
            <tr key={e.id} className="border-t border-gray-700">
              <td className="px-2 py-1">{e.token}</td>
              <td className="px-2 py-1 text-primary">{e.id}</td>
              <td className="px-2 py-1">{e.frequency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-4 bg-gray-900/50 backdrop-blur-xs rounded-lg border border-white/10">
      <h2 className="text-xl font-semibold mb-3 text-primary">01. Build Your Vocabulary</h2>
      <p className="mb-4 text-gray-300">Give the AI a collection of words and sentences to learn from.</p>
      <div className="flex flex-col md:flex-row gap-4">
        <textarea
          className="flex-1 p-2 bg-gray-800 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          rows={6}
          placeholder="Enter words or sentences, one per line..."
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
        />
        <div className="flex flex-col space-y-2">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded hover:bg-primary/80 transition"
            onClick={handleInitialize}
          >
            <Play className="w-4 h-4" />
            <span>Initialize AI Pipeline →</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition"
            onClick={loadDemo}
          >
            Load Demo Vocabulary
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-200 rounded cursor-pointer hover:bg-gray-600 transition">
            <Upload className="w-4 h-4" />
            Upload .txt
            <input
              type="file"
              accept=".txt"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-400">
        <span>Total words: {wordCount}</span> | <span>Unique words: {uniqueCount}</span>
      </div>
      {renderTable()}
    </div>
  );
};

export default VocabularyBuilder;
