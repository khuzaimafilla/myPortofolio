import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { Search, Home, User, Code, FolderGit2, Mail, FileText, ExternalLink, Command as CmdIcon } from 'lucide-react';
import { portfolioData } from '@data/portfolioData';

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const navigateTo = (id: string) => {
    setOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const openUrl = (url: string) => {
    setOpen(false);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={() => setOpen(false)} 
      />
      <div className="relative w-full max-w-xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl shadow-accent-red/10 overflow-hidden z-10 font-sans">
        <Command className="w-full bg-transparent text-slate-200">
          <div className="flex items-center px-4 border-b border-white/10">
            <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
            <Command.Input
              autoFocus
              placeholder="Type a command or search section..."
              className="w-full py-4 bg-transparent text-slate-100 placeholder-slate-500 outline-none font-sans text-sm"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-slate-400 bg-slate-800 rounded border border-white/10">
              <span className="text-xs">ESC</span>
            </kbd>
          </div>

          <Command.List className="max-h-[350px] overflow-y-auto p-2 space-y-1">
            <Command.Empty className="py-6 text-center text-sm text-slate-500">
              No matching commands found.
            </Command.Empty>

            <Command.Group heading="Navigation" className="text-xs font-semibold text-slate-500 px-2 py-1 uppercase tracking-wider">
              <Command.Item
                onSelect={() => navigateTo('hero')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 cursor-pointer transition-colors"
              >
                <Home className="w-4 h-4 text-accent-gold" />
                <span>Home</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo('about')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 cursor-pointer transition-colors"
              >
                <User className="w-4 h-4 text-accent-red" />
                <span>About Me</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo('skills')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 cursor-pointer transition-colors"
              >
                <Code className="w-4 h-4 text-accent-gold" />
                <span>Skills & Expertise</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo('projects')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 cursor-pointer transition-colors"
              >
                <FolderGit2 className="w-4 h-4 text-accent-red" />
                <span>Featured Projects</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo('contact')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 cursor-pointer transition-colors"
              >
                <Mail className="w-4 h-4 text-accent-gold" />
                <span>Contact & Connect</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Actions" className="text-xs font-semibold text-slate-500 px-2 py-1 uppercase tracking-wider mt-2">
              <Command.Item
                onSelect={() => openUrl(portfolioData.cvUrl)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 cursor-pointer transition-colors"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Download Resume (CV)</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Social Links" className="text-xs font-semibold text-slate-500 px-2 py-1 uppercase tracking-wider mt-2">
              <Command.Item
                onSelect={() => openUrl(portfolioData.contact.linkedin)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 cursor-pointer transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-blue-400" />
                <span>LinkedIn Profile</span>
              </Command.Item>
              <Command.Item
                onSelect={() => openUrl(portfolioData.contact.github || '#')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 cursor-pointer transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-slate-300" />
                <span>GitHub Repositories</span>
              </Command.Item>
              <Command.Item
                onSelect={() => openUrl(portfolioData.contact.instagram)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 cursor-pointer transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-pink-400" />
                <span>Instagram Profile</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/10 bg-slate-900/50 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              Use <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-white/10 text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-white/10 text-[10px]">↓</kbd> to navigate
            </span>
            <span className="flex items-center gap-1">
              Press <CmdIcon className="w-3 h-3 inline" /> + K anytime
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
};

export default CommandPalette;
