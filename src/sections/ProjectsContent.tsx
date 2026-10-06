import React, { useState } from 'react';
import { Compass, Sparkles, FolderGit2, ArrowUpRight } from 'lucide-react';
import { PROJECTS, ProjectItem } from '../data/portfolioData';
import { sound } from '../audio/soundEffects';

export const ProjectsContent: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(PROJECTS[0].id);

  const activeProject = PROJECTS.find((p) => p.id === selectedProjectId) || PROJECTS[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <FolderGit2 className="w-4 h-4" />
          <span>ZONE 03 // ARCHIVE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-light text-white tracking-wide mt-1">
          PROJECTS
        </h2>
        <p className="text-sm text-slate-400 font-light mt-0.5">
          Platforms and automated systems engineered for production deployment.
        </p>
      </div>

      {/* Project Selector Horizontal Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {PROJECTS.map((proj, idx) => {
          const isSelected = proj.id === selectedProjectId;
          return (
            <button
              key={proj.id}
              type="button"
              onClick={() => {
                sound.playHover();
                setSelectedProjectId(proj.id);
              }}
              className={`p-3 rounded-lg text-left transition-all border cursor-pointer backdrop-blur-md ${
                isSelected
                  ? 'bg-[#091524]/90 border-cyan-400/60 shadow-[0_0_15px_rgba(0,229,255,0.12)]'
                  : 'bg-[#060b14]/70 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>0{idx + 1}</span>
                {proj.isHero && <span className="text-cyan-400 text-[10px]">HERO</span>}
              </div>
              <h3 className="text-xs sm:text-sm font-medium text-white truncate mt-1">
                {proj.title}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Main Showcase Artifact Card */}
      <div
        className={`p-6 sm:p-7 rounded-xl border backdrop-blur-md space-y-6 ${
          activeProject.isHero
            ? 'bg-[#06101c]/80 border-cyan-500/40 shadow-[0_0_30px_rgba(0,229,255,0.08)]'
            : 'bg-[#060b14]/80 border-slate-800/80'
        }`}
      >
        {/* Title, Badge & Technologies */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 tracking-wider">
                {activeProject.isHero ? 'FLAGSHIP ARCHITECTURE' : 'SYSTEM ARCHIVE'}
              </span>
              {activeProject.isHero && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-300">
                  <Sparkles className="w-3 h-3" />
                  <span>Featured Platform</span>
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white mt-1">
              {activeProject.title}
            </h3>
            {activeProject.subtitle && (
              <p className="text-sm font-mono text-slate-400 mt-0.5">
                {activeProject.subtitle}
              </p>
            )}
          </div>

          {/* Clean metadata technologies */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-300">
            {activeProject.technologies.map((tech, idx) => (
              <React.Fragment key={tech}>
                <span className="text-cyan-300/90">{tech}</span>
                {idx < activeProject.technologies.length - 1 && (
                  <span className="text-slate-600">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Hero Interactive Map / Visual Wireframe for Tour It */}
        {activeProject.id === 'tour-it' && (
          <div className="p-4 rounded-lg bg-[#030811] border border-cyan-950 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <Compass className="w-3.5 h-3.5" />
                <span>AI ITINERARY & WORKFLOW ARCHITECTURE</span>
              </span>
              <span>RESTful / Scalable Foundation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-slate-300 text-xs">
              <div className="p-3 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-cyan-400 block mb-1">01. PREFERENCE ENGINE</span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  User budget, travel duration, and experiential preference ingestion.
                </p>
              </div>
              <div className="p-3 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-cyan-400 block mb-1">02. AI WORKFLOWS</span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Algorithmic itinerary synthesis and intelligent recommendation pipelines.
                </p>
              </div>
              <div className="p-3 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-cyan-400 block mb-1">03. INTEGRATIONS</span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Scalable system ready for future maps, lodging, and event integrations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Project Description Points */}
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            System Implementation
          </span>
          <ul className="space-y-2.5">
            {activeProject.description.map((bullet, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed font-light"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
