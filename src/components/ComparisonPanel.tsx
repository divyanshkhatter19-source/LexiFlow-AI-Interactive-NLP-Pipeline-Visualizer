// src/components/ComparisonPanel.tsx
import React from "react";
import { usePipeline } from "../hooks/usePipeline";
import { generateSpellingEmbeddings } from "../algorithms/spellingEmbeddings";
import { generateSemanticEmbeddings } from "../algorithms/semanticEmbeddings";
import { TokenInfo } from "../types";

/** Simple Euclidean distance */
const euclidean = (a: number[], b: number[]) => {
  return Math.sqrt(a.reduce((sum, v, i) => sum + (v - b[i]) ** 2, 0));
};

const ComparisonPanel: React.FC = () => {
  const { subwordTokens, selectedToken } = usePipeline();

  if (!selectedToken) {
    return (
      <div className="p-4 bg-gray-900/30 rounded border border-white/10 text-gray-400">
        Select a token in either 3D graph to see a comparison.
      </div>
    );
  }

  const spellingEmb = generateSpellingEmbeddings(subwordTokens);
  const semanticEmb = generateSemanticEmbeddings(subwordTokens);

  const selSpVec = spellingEmb[selectedToken.text] ?? [0, 0, 0];
  const selSeVec = semanticEmb[selectedToken.text] ?? [0, 0, 0];

  // Find nearest neighbor (excluding self) in each space
  const nearest = (embMap: Record<string, [number, number, number]>, vec: number[]) => {
    let bestToken = "";
    let bestDist = Infinity;
    Object.entries(embMap).forEach(([tok, v]) => {
      if (tok === selectedToken.text) return;
      const d = euclidean(v, vec);
      if (d < bestDist) {
        bestDist = d;
        bestToken = tok;
      }
    });
    return { token: bestToken, distance: bestDist };
  };

  const nearestSpelling = nearest(spellingEmb, selSpVec);
  const nearestSemantic = nearest(semanticEmb, selSeVec);

  return (
    <div className="p-4 bg-gray-900/30 rounded border border-white/10">
      <h3 className="text-lg font-medium text-primary mb-2">Spelling vs Meaning</h3>
      <p><strong>Selected Token:</strong> {selectedToken.text}</p>
      <p><strong>Spelling Vector:</strong> [{selSpVec.map((n) => n.toFixed(2)).join(", ")} ]</p>
      <p><strong>Nearest (Spelling Space):</strong> {nearestSpelling.token || "N/A"} (dist {nearestSpelling.distance.toFixed(2)})</p>
      <p className="mt-2"><strong>Semantic Vector:</strong> [{selSeVec.map((n) => n.toFixed(2)).join(", ")} ]</p>
      <p><strong>Nearest (Meaning Space):</strong> {nearestSemantic.token || "N/A"} (dist {nearestSemantic.distance.toFixed(2)})</p>
    </div>
  );
};

export default ComparisonPanel;
