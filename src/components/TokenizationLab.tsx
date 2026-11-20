// src/components/TokenizationLab.tsx
import React, { useEffect, useState } from "react";
import { usePipeline } from "../hooks/usePipeline";
import { TokenInfo } from "../types";
import { Play } from "lucide-react";

const TokenizationLab: React.FC = () => {
  const {
    sentence,
    setSentence,
    tokenInfos,
    subwordTokens,
    initializePipeline,
    selectedToken,
    setSelectedToken,
  } = usePipeline();

  const [showAnimation, setShowAnimation] = useState(false);

  const handleSentenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSentence(e.target.value);
  };

  const handleRun = () => {
    initializePipeline();
    setShowAnimation(false);
  };

  const handlePlay = () => {
    setShowAnimation(true);
  };

  // When animation is on, we could step through tokenization stages – simplified as instant.
  useEffect(() => {
    if (showAnimation) {
      // In a real app we would animate, here we just re‑run to ensure state is up‑to‑date.
      initializePipeline();
    }
  }, [showAnimation, initializePipeline]);

  const renderTokens = (tokens: TokenInfo[]) => {
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {tokens.map((t, i) => (
          <span
            key={i}
            className={`px-2 py-1 rounded cursor-pointer transition-colors ${
              selectedToken?.id === t.id ? "bg-primary text-black" : "bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => setSelectedToken(t)}
          >
            {t.text}
          </span>
        ))}
      </div>
    );
  };

  const tokenDetails = selectedToken ? (
    <div className="mt-4 p-4 bg-gray-900/50 rounded border border-white/10">
      <h4 className="text-lg font-medium mb-2">Token Details</h4>
      <p><strong>Text:</strong> {selectedToken.text}</p>
      <p><strong>Type:</strong> {selectedToken.type}</p>
      <p><strong>ID:</strong> {selectedToken.id}</p>
      <p><strong>Original Word:</strong> {selectedToken.originalWord}</p>
      <p><strong>Position:</strong> {selectedToken.position}</p>
    </div>
  ) : null;

  return (
    <div className="p-4 bg-gray-900/50 backdrop-blur-xs rounded-lg border border-white/10">
      <h2 className="text-xl font-semibold mb-3 text-primary">02. Interactive Tokenization Lab</h2>
      <p className="mb-4 text-gray-300">Type anything and watch how the AI breaks language into tokens.</p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 p-2 bg-gray-800 rounded text-white focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter a sentence..."
          value={sentence}
          onChange={handleSentenceChange}
        />
        <button
          className="px-4 py-2 bg-primary text-black rounded hover:bg-primary/80 transition"
          onClick={handleRun}
        >
          Tokenize
        </button>
        <button
          className="px-3 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition"
          onClick={handlePlay}
        >
          <Play className="w-4 h-4 inline-block" /> Play Tokenization Process
        </button>
      </div>

      {sentence && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-primary mb-2">Original Sentence</h3>
          <p className="text-gray-200">{sentence}</p>

          <h3 className="text-lg font-medium text-primary mt-4 mb-2">Initial Tokenization</h3>
          {renderTokens(tokenInfos)}

          <h3 className="text-lg font-medium text-primary mt-4 mb-2">Subword Tokenization (BPE)</h3>
          {renderTokens(subwordTokens)}
        </div>
      )}

      {tokenDetails}
    </div>
  );
};

export default TokenizationLab;
