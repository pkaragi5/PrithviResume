import React, { useState } from 'react';
import { Briefcase, Building2, Calendar, MapPin } from 'lucide-react';
import { EXPERIENCES } from '../data/portfolioData';
import { sound } from '../audio/soundEffects';

export const ExperienceContent: React.FC = () => {
  const [selectedExpId, setSelectedExpId] = useState<string>(EXPERIENCES[0].id);

  const activeExp = EXPERIENCES.find((e) => e.id === selectedExpId) || EXPERIENCES[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Briefcase className="w-4 h-4" />
          <span>ZONE 04 // TIMELINE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-light text-white tracking-wide mt-1">
          EXPERIENCE
        </h2>
        <p className="text-sm text-slate-400 font-light mt-0.5">
          Engineering, technology operations, and enterprise simulation records.
        </p>
      </div>

      {/* Nodes Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {EXPERIENCES.map((exp) => {
          const isSelected = exp.id === selectedExpId;
          return (
            <button
              key={exp.id}
              type="button"
              onClick={() => {
                sound.playHover();
                setSelectedExpId(exp.id);
              }}
              className={`p-4 rounded-lg text-left transition-all border cursor-pointer backdrop-blur-md ${
                isSelected
                  ? 'bg-[#091524]/90 border-cyan-400/60 shadow-[0_0_15px_rgba(0,229,255,0.12)]'
                  : 'bg-[#060b14]/70 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>{exp.type}</span>
                {exp.date && <span>{exp.date}</span>}
              </div>
              <h3 className="text-sm font-semibold text-white mt-1">
                {exp.company}
              </h3>
              {exp.parentOrg && (
                <div className="text-xs text-slate-400 font-light">
                  {exp.parentOrg}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Experience Node Card */}
      <div className="p-6 sm:p-7 rounded-xl bg-[#080e1b] border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/60 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Building2 className="w-3.5 h-3.5" />
              <span>{activeExp.company}</span>
              {activeExp.parentOrg && (
                <>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">{activeExp.parentOrg}</span>
                </>
              )}
            </div>
            <h3 className="text-xl font-medium text-white mt-1">
              {activeExp.role}
            </h3>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            {activeExp.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span>{activeExp.location}</span>
              </span>
            )}
            {activeExp.date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>{activeExp.date}</span>
              </span>
            )}
          </div>
        </div>

        {/* Responsibilities list */}
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Responsibilities & Outcomes
          </span>
          <ul className="space-y-2.5">
            {activeExp.responsibilities.map((resp, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed font-light"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
