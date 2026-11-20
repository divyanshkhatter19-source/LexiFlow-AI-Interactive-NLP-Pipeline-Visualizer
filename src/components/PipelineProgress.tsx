// src/components/PipelineProgress.tsx
import React from "react";
import { usePipeline } from "../hooks/usePipeline";

const stages = [
  { id: "vocab", label: "Vocabulary Input" },
  { id: "tokenization", label: "Tokenization" },
  { id: "subword", label: "Subword Processing" },
  { id: "ids", label: "Token IDs" },
  { id: "embeddings", label: "Vector Embeddings" },
];

const PipelineProgress: React.FC = () => {
  const { vocabArray, tokenInfos, subwordTokens } = usePipeline();
  const completed = {
    vocab: vocabArray.length > 0,
    tokenization: tokenInfos.length > 0,
    subword: subwordTokens.length > 0,
    ids: tokenInfos.length > 0, // same as tokenization after BPE
    embeddings: tokenInfos.length > 0, // placeholder
  };

  return (
    <nav className="flex justify-center space-x-4 py-2 bg-background bg-opacity-50 backdrop-blur-xs border-b border-white/10">
      {stages.map((stage) => (
        <div
          key={stage.id}
          className={`px-3 py-1 rounded transition-colors ${completed[stage.id as keyof typeof completed] ? "bg-primary text-black" : "bg-gray-800 text-gray-400"}`}
        >
          {stage.label}
        </div>
      ))}
    </nav>
  );
};

export default PipelineProgress;
