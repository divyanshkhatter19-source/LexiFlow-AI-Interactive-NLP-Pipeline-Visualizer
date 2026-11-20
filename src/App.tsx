// src/App.tsx
import React from "react";
import Navbar from "./components/Navbar";
import PipelineProgress from "./components/PipelineProgress";
import VocabularyBuilder from "./components/VocabularyBuilder";
import TokenizationLab from "./components/TokenizationLab";
import EmbeddingVisualizer from "./components/EmbeddingVisualizer";
import ComparisonPanel from "./components/ComparisonPanel";
import { PipelineProvider } from "./hooks/usePipeline";

const App: React.FC = () => {
  return (
    <PipelineProvider>
      <div className="min-h-screen flex flex-col bg-background text-white font-sans">
        <Navbar />
        <PipelineProgress />
        <main className="flex-1 p-4 space-y-8">
          <section id="vocab" className="space-y-4">
            <VocabularyBuilder />
          </section>
          <section id="tokenization" className="space-y-4">
            <TokenizationLab />
          </section>
          <section id="embedding" className="space-y-4">
            <EmbeddingVisualizer />
            <ComparisonPanel />
          </section>
        </main>
        <footer className="p-4 text-center text-sm opacity-70">
          LexiFlow AI © 2026 – Interactive NLP Pipeline Visualizer
        </footer>
      </div>
    </PipelineProvider>
  );
};

export default App;
