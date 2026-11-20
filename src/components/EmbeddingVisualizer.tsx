// src/components/EmbeddingVisualizer.tsx
import React, { useEffect, useRef } from "react";
import Plotly, { TraceData, Layout, Config, PlotlyHTMLElement, PlotMouseEvent } from "plotly.js-dist-min";
import { usePipeline } from "../hooks/usePipeline";
import { TokenInfo } from "../types";
import { generateSpellingEmbeddings } from "../algorithms/spellingEmbeddings";
import { generateSemanticEmbeddings } from "../algorithms/semanticEmbeddings";

/** Build a Plotly 3-D scatter trace */
function buildTrace(
  tokens: TokenInfo[],
  embMap: Record<string, [number, number, number]>,
  defaultColor: string,
  highlightColor: string,
  selectedId: number | undefined
): TraceData {
  const x: number[] = [];
  const y: number[] = [];
  const z: number[] = [];
  const texts: string[] = [];
  const colors: string[] = [];
  const sizes: number[] = [];

  tokens.forEach((t) => {
    const vec = embMap[t.text] ?? [0, 0, 0];
    x.push(vec[0]);
    y.push(vec[1]);
    z.push(vec[2]);
    texts.push(t.text);
    const isSelected = selectedId !== undefined && t.id === selectedId;
    colors.push(isSelected ? highlightColor : defaultColor);
    sizes.push(isSelected ? 12 : 7);
  });

  return {
    x, y, z,
    text: texts,
    mode: "markers+text",
    type: "scatter3d",
    marker: { size: sizes, color: colors, opacity: 0.9 },
    textposition: "top center",
    hoverinfo: "text",
  };
}

const sharedLayout: Partial<Layout> = {
  margin: { l: 0, r: 0, b: 0, t: 50 },
  paper_bgcolor: "rgba(0,0,0,0)",
  scene: {
    bgcolor: "rgba(10,12,30,0.8)",
    xaxis: { color: "#aaa" },
    yaxis: { color: "#aaa" },
    zaxis: { color: "#aaa" },
  },
  font: { color: "#fff" },
};

const plotConfig: Partial<Config> = { responsive: true, displayModeBar: false };

const EmbeddingVisualizer: React.FC = () => {
  const { subwordTokens, selectedToken, setSelectedToken } = usePipeline();
  const spellingDiv = useRef<HTMLDivElement>(null);
  const semanticDiv = useRef<HTMLDivElement>(null);

  /* Re-draw both plots on token/selection changes */
  useEffect(() => {
    if (!subwordTokens.length) return;

    const spellingEmb = generateSpellingEmbeddings(subwordTokens);
    const semanticEmb = generateSemanticEmbeddings(subwordTokens);
    const selId = selectedToken?.id;

    if (spellingDiv.current) {
      Plotly.react(
        spellingDiv.current,
        [buildTrace(subwordTokens, spellingEmb, "#00e5ff", "#ff4444", selId)],
        {
          ...sharedLayout,
          title: { text: "Spelling Space (Character Features)", font: { color: "#00e5ff", size: 13 } },
        },
        plotConfig
      );
    }
    if (semanticDiv.current) {
      Plotly.react(
        semanticDiv.current,
        [buildTrace(subwordTokens, semanticEmb, "#a855f7", "#ff4444", selId)],
        {
          ...sharedLayout,
          title: { text: "Meaning Space (Semantic Features)", font: { color: "#a855f7", size: 13 } },
        },
        plotConfig
      );
    }
  }, [subwordTokens, selectedToken]);

  /* Attach click handlers after plots are drawn */
  useEffect(() => {
    if (!subwordTokens.length) return;

    const handleClick = (data: PlotMouseEvent) => {
      const idx = data.points[0]?.pointIndex;
      const token = subwordTokens[idx];
      if (token) setSelectedToken(token);
    };

    const spEl = spellingDiv.current as PlotlyHTMLElement | null;
    const seEl = semanticDiv.current as PlotlyHTMLElement | null;
    spEl?.on("plotly_click", handleClick);
    seEl?.on("plotly_click", handleClick);

    return () => {
      spEl?.removeAllListeners("plotly_click");
      seEl?.removeAllListeners("plotly_click");
    };
  }, [subwordTokens, setSelectedToken]);

  if (!subwordTokens.length) {
    return (
      <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-2 text-cyan-400">03. Explore Vector Embeddings</h2>
        <p className="text-gray-400">
          Build your vocabulary and type a sentence above, then click{" "}
          <strong className="text-white">Initialize AI Pipeline →</strong> to generate 3-D embeddings.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm space-y-4">
      <h2 className="text-xl font-semibold text-cyan-400">03. Explore Vector Embeddings</h2>
      <p className="text-sm text-gray-400">
        Each token is plotted in 3-D feature space. Click a point in either graph to select it —
        selection is synchronized across both plots.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-cyan-400 mb-1 font-semibold uppercase tracking-wider">
            Lexical Similarity — Spelling Space
          </p>
          <div ref={spellingDiv} style={{ height: 400, width: "100%" }} />
        </div>
        <div>
          <p className="text-xs text-purple-400 mb-1 font-semibold uppercase tracking-wider">
            Semantic Similarity — Meaning Space
          </p>
          <div ref={semanticDiv} style={{ height: 400, width: "100%" }} />
        </div>
      </div>
    </div>
  );
};

export default EmbeddingVisualizer;
