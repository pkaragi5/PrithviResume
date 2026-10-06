import React from 'react';
import { User, GraduationCap, Globe, MapPin } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export const AboutContent: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <User className="w-4 h-4" />
          <span>ZONE 05 // IDENTITY & FOUNDATION</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-light text-white tracking-wide mt-1">
          ABOUT
        </h2>
        <p className="text-sm text-slate-400 font-light mt-0.5">
          Engineering trajectory, academic foundation, and linguistics.
        </p>
      </div>

      {/* Editorial Profile Monolith */}
      <div className="p-6 sm:p-7 rounded-xl bg-[#070b14]/80 border border-slate-800/80 backdrop-blur-md space-y-6">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase">
            Profile
          </span>
          <h3 className="text-2xl font-light text-white mt-1">
            {PERSONAL_INFO.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mt-1">
            <span className="text-cyan-300">{PERSONAL_INFO.positioning}</span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-500" />
              {PERSONAL_INFO.location}
            </span>
          </div>
        </div>

        {/* Resume Summary */}
        <div className="pt-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
            Professional Summary
          </span>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light border-l-2 border-cyan-500/50 pl-4 py-1">
            {PERSONAL_INFO.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-800/60">
          {/* Education */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <GraduationCap className="w-4 h-4" />
              <span>ACADEMIC FOUNDATION</span>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800/70">
              <h4 className="text-sm font-semibold text-white">
                {PERSONAL_INFO.education.institution}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                {PERSONAL_INFO.education.degree}
              </p>
              <p className="text-[11px] font-mono text-slate-400 mt-1">
                {PERSONAL_INFO.education.location}
              </p>
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Globe className="w-4 h-4" />
              <span>LINGUISTICS</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {PERSONAL_INFO.languages.map((lang) => (
                <div
                  key={lang.language}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-800/70"
                >
                  <span className="text-xs font-mono text-white">
                    {lang.language}
                  </span>
                  <span className="text-xs font-mono text-cyan-300/90">
                    {lang.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
