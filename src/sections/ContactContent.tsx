import React, { useState } from 'react';
import { Mail, Phone, Linkedin, Github, MapPin, Copy, Check, Send } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { sound } from '../audio/soundEffects';

export const ContactContent: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    sound.playHover();
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const contactItems = [
    {
      key: 'email',
      label: 'Email',
      value: PERSONAL_INFO.email,
      href: `mailto:${PERSONAL_INFO.email}`,
      icon: Mail,
      isLink: true,
    },
    {
      key: 'phone',
      label: 'Phone',
      value: PERSONAL_INFO.phone,
      href: `tel:${PERSONAL_INFO.phone}`,
      icon: Phone,
      isLink: true,
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      value: PERSONAL_INFO.linkedIn,
      href: PERSONAL_INFO.linkedInUrl,
      icon: Linkedin,
      isLink: true,
      external: true,
    },
    {
      key: 'github',
      label: 'GitHub',
      value: PERSONAL_INFO.github,
      href: PERSONAL_INFO.githubUrl,
      icon: Github,
      isLink: true,
      external: true,
    },
    {
      key: 'location',
      label: 'Location',
      value: PERSONAL_INFO.location,
      href: undefined,
      icon: MapPin,
      isLink: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Send className="w-4 h-4" />
          <span>ZONE 06 // TRANSMISSION TERMINAL</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-light text-white tracking-wide mt-1">
          LET'S BUILD SOMETHING.
        </h2>
        <p className="text-sm text-slate-400 font-light mt-0.5">
          Reach out for engineering roles, technical collaboration, or founder dialogues.
        </p>
      </div>

      {/* Terminal Cards */}
      <div className="p-6 sm:p-7 rounded-xl bg-[#080e1b] border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {contactItems.map((item) => {
            const Icon = item.icon;
            const isCopied = copiedKey === item.key;
            return (
              <div
                key={item.key}
                className="group flex items-center justify-between p-3.5 rounded-lg bg-slate-900/40 hover:bg-[#0c1827] border border-slate-800/80 hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 rounded bg-slate-800/50 text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">
                      {item.label}
                    </span>
                    {item.isLink && item.href ? (
                      <a
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className="text-xs font-mono text-slate-200 hover:text-cyan-300 transition-colors truncate block"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-xs font-mono text-slate-200 truncate block">
                        {item.value}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(item.key, item.value)}
                  className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-cyan-400 active:text-cyan-300 rounded transition-colors cursor-pointer shrink-0"
                  title={`Copy ${item.label}`}
                  aria-label={`Copy ${item.label}`}
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/60">
          <div className="text-xs font-mono text-slate-400">
            Open for software engineering opportunities in Bangalore, India and remote.
          </div>
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-200 rounded text-xs font-mono tracking-wider transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>TRANSMIT DIRECT EMAIL</span>
          </a>
        </div>
      </div>
    </div>
  );
};
