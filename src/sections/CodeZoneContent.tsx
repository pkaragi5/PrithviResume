import React, { useState } from 'react';
import { Terminal, Cpu, Wrench, Users, Check } from 'lucide-react';
import { SKILL_GROUPS } from '../data/portfolioData';
import { sound } from '../audio/soundEffects';

export const CodeZoneContent: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedSkill, setCopiedSkill] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Stacks', icon: Terminal },
    { id: 'Technical Skills', label: 'Technical Skills', icon: Cpu },
    { id: 'Tools and Technologies', label: 'Tools & Technologies', icon: Wrench },
    { id: 'Soft Skills', label: 'Soft Skills', icon: Users },
  ];

  const filteredGroups =
    selectedCategory === 'all'
      ? SKILL_GROUPS
      : SKILL_GROUPS.filter((g) => g.category === selectedCategory);

  const handleCopy = (skill: string) => {
    sound.playHover();
    navigator.clipboard?.writeText(skill);
    setCopiedSkill(skill);
    setTimeout(() => setCopiedSkill(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Terminal className="w-4 h-4" />
          <span>ZONE 01 // DEV TERMINAL</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-light text-white tracking-wide mt-1">
          CODE
        </h2>
        <p className="text-sm text-slate-400 font-light mt-0.5">
          The tools I build with.
        </p>
      </div>

      {/* Segmented Filter Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/60 border border-slate-800/80 rounded-lg">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                sound.playHover();
                setSelectedCategory(cat.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Terminal Viewport Container */}
      <div className="space-y-6">
        {filteredGroups.map((group) => (
          <div
            key={group.category}
            className="p-5 rounded-lg bg-[#070b14]/70 border border-slate-800/80 backdrop-blur-md space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                {group.category}
              </span>
              <span className="text-[11px] font-mono text-cyan-400/80 tabular-nums">
                {group.skills.length} items
              </span>
            </div>

            {/* Interactive Grid of Technical Items */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {group.skills.map((skill) => {
                const isCopied = copiedSkill === skill;
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleCopy(skill)}
                    onMouseEnter={() => sound.playHover()}
                    className="group relative flex items-center justify-between p-2.5 rounded bg-slate-900/40 hover:bg-[#0c1827] border border-slate-800/70 hover:border-cyan-500/40 text-left transition-all cursor-pointer"
                  >
                    <span className="text-xs font-mono text-slate-200 group-hover:text-cyan-200 transition-colors">
                      {skill}
                    </span>
                    <span className="text-slate-500 group-hover:text-cyan-400 transition-colors">
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                      ) : (
                        <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                          copy
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
