import React, { useState } from 'react';
import { ArrowLeft, Box, Brain, Briefcase, Code2, Compass, FolderGit2, Mail, User } from 'lucide-react';
import { PERSONAL_INFO, ZONES, ZoneConfig } from '../../data/portfolioData';
import { CodeZoneContent } from '../../sections/CodeZoneContent';
import { AiLabContent } from '../../sections/AiLabContent';
import { ProjectsContent } from '../../sections/ProjectsContent';
import { ExperienceContent } from '../../sections/ExperienceContent';
import { AboutContent } from '../../sections/AboutContent';
import { ContactContent } from '../../sections/ContactContent';
import { sound } from '../../audio/soundEffects';

interface FallbackPortfolioProps {
  onSwitchTo3D: () => void;
  activeZoneId?: ZoneConfig['id'];
}

export const FallbackPortfolio: React.FC<FallbackPortfolioProps> = ({
  onSwitchTo3D,
  activeZoneId = 'hub',
}) => {
  const [currentTab, setCurrentTab] = useState<ZoneConfig['id']>(
    activeZoneId === 'hub' ? 'about' : activeZoneId
  );

  const tabs: { id: ZoneConfig['id']; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'about', label: 'About', icon: User },
    { id: 'code', label: 'Code & Skills', icon: Code2 },
    { id: 'ai', label: 'AI Lab', icon: Brain },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[#050608] text-[#E5E7EB] pt-20 pb-16 px-4 sm:px-6 md:px-12">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Editorial Hero Header */}
        <div className="border-b border-slate-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Compass className="w-4 h-4" />
              <span>EDITORIAL ARCHIVE MODE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-light tracking-wide text-white">
              {PERSONAL_INFO.name}
            </h1>
            <p className="font-mono text-xs sm:text-sm text-cyan-300">
              {PERSONAL_INFO.positioning} · {PERSONAL_INFO.location}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playTransition();
              onSwitchTo3D();
            }}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-[#081a28] border border-cyan-500/40 text-cyan-300 rounded text-xs font-mono transition-colors cursor-pointer"
          >
            <Box className="w-3.5 h-3.5" />
            <span>SWITCH TO 3D EXPERIENCE</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  sound.playHover();
                  setCurrentTab(tab.id);
                }}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-medium'
                    : 'bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Section Content */}
        <div className="pt-2">
          {currentTab === 'about' && <AboutContent />}
          {currentTab === 'code' && <CodeZoneContent />}
          {currentTab === 'ai' && <AiLabContent />}
          {currentTab === 'projects' && <ProjectsContent />}
          {currentTab === 'experience' && <ExperienceContent />}
          {currentTab === 'contact' && <ContactContent />}
        </div>
      </div>
    </div>
  );
};
