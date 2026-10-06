import React, { useState } from 'react';
import { Sparkles, Brain, Scan, Activity } from 'lucide-react';
import { AI_LAB_EXPERIMENTS } from '../data/portfolioData';
import { sound } from '../audio/soundEffects';

export const AiLabContent: React.FC = () => {
  const [activeExperiment, setActiveExperiment] = useState(AI_LAB_EXPERIMENTS[0].id);

  const experiment = AI_LAB_EXPERIMENTS.find((e) => e.id === activeExperiment) || AI_LAB_EXPERIMENTS[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Brain className="w-4 h-4" />
          <span>ZONE 02 // RESEARCH & MACHINE LEARNING</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-light text-white tracking-wide mt-1">
          AI LAB
        </h2>
        <p className="text-sm text-slate-400 font-light mt-0.5">
          Supervised classification and computer vision deployment workflows.
        </p>
      </div>

      {/* Experiment Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {AI_LAB_EXPERIMENTS.map((item) => {
          const isSelected = item.id === activeExperiment;
          const Icon = item.id === 'breast-cancer-prediction' ? Activity : Scan;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                sound.playHover();
                setActiveExperiment(item.id);
              }}
              className={`p-4 rounded-lg text-left transition-all border cursor-pointer backdrop-blur-md ${
                isSelected
                  ? 'bg-[#091524]/90 border-cyan-400/60 shadow-[0_0_20px_rgba(0,229,255,0.1)]'
                  : 'bg-[#060b14]/70 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="text-[10px] font-mono tracking-wider uppercase text-slate-500">
                  {item.domain}
                </span>
              </div>
              <h3 className="text-base font-medium text-white mt-2">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-2 font-mono">
                {item.technologies.map((t, idx) => (
                  <React.Fragment key={t}>
                    <span>{t}</span>
                    {idx < item.technologies.length - 1 && <span className="text-slate-600">·</span>}
                  </React.Fragment>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Model Architecture Panel */}
      <div className="p-6 rounded-lg bg-[#070b14]/80 border border-slate-800/80 backdrop-blur-md space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
              System Specification
            </span>
            <h4 className="text-lg font-medium text-white mt-0.5">
              {experiment.title}
            </h4>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reproducible ML Pipeline</span>
          </div>
        </div>

        {/* Abstract Neural / Pipeline Graph */}
        <div className="p-4 rounded bg-[#04070e] border border-slate-900 font-mono text-xs text-slate-400">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">
            Execution Flow
          </div>
          <div className="flex flex-wrap items-center gap-2 text-cyan-300">
            {experiment.id === 'breast-cancer-prediction' ? (
              <>
                <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">Medical Dataset</span>
                <span className="text-slate-600">→</span>
                <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">Feature Preprocessing</span>
                <span className="text-slate-600">→</span>
                <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">Scikit-learn Classifiers</span>
                <span className="text-slate-600">→</span>
                <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">Evaluation & Inferences</span>
              </>
            ) : (
              <>
                <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">Visual Stream</span>
                <span className="text-slate-600">→</span>
                <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">YOLO Object Detection</span>
                <span className="text-slate-600">→</span>
                <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">Classification Weights</span>
                <span className="text-slate-600">→</span>
                <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">Streamlit Dashboard</span>
              </>
            )}
          </div>
        </div>

        {/* Detailed Points */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Key Contributions
          </div>
          <ul className="space-y-2.5">
            {experiment.details.map((point, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed font-light">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
