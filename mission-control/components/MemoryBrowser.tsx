'use client';

import { BookOpen, FileText, Calendar, Star, Search, Brain, Tag, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MemoryFile {
  name: string;
  path: string;
  type: 'core' | 'daily' | 'important';
  lastModified?: string;
  preview?: string;
}

interface DbMemory {
  id: number;
  content: string;
  category: string;
  importance: number;
  source?: string;
  tags?: string[];
  created_at: string;
}

const typeConfig = {
  core: { icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'Core' },
  daily: { icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Daily' },
  important: { icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/20', label: 'Important' },
};

const categoryColors: Record<string, string> = {
  fact: 'bg-blue-500/20 text-blue-400',
  preference: 'bg-pink-500/20 text-pink-400',
  task: 'bg-emerald-500/20 text-emerald-400',
  insight: 'bg-amber-500/20 text-amber-400',
  context: 'bg-purple-500/20 text-purple-400',
};

export function MemoryBrowser() {
  const [selectedFile, setSelectedFile] = useState<MemoryFile | null>(null);
  const [dbMemories, setDbMemories] = useState<DbMemory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'files' | 'db'>('files');
  const [isLoading, setIsLoading] = useState(false);
  const [fileMemories, setFileMemories] = useState<MemoryFile[]>([
    {
      name: 'MEMORY.md',
      path: '/MEMORY.md',
      type: 'core',
      lastModified: '2026-02-25',
      preview: 'Core identity, mission, budget constraints, Mohammed\'s background'
    },
    {
      name: 'USER.md',
      path: '/USER.md',
      type: 'core',
      lastModified: '2026-02-25',
      preview: 'Mohammed Wasif - background, goals, preferences'
    },
    {
      name: 'SOUL.md',
      path: '/SOUL.md',
      type: 'core',
      lastModified: '2026-02-25',
      preview: 'mohltbot personality, voice, boundaries'
    },
    {
      name: '2026-02-25.md',
      path: '/memory/2026-02-25.md',
      type: 'daily',
      lastModified: '2026-02-25',
      preview: 'Daily log - Mission Control v0.1 built, 5 tasks completed'
    }
  ]);

  // Fetch database memories
  useEffect(() => {
    if (activeTab === 'db') {
      fetchMemories();
    }
  }, [activeTab, searchQuery]);

  const fetchMemories = async () => {
    setIsLoading(true);
    try {
      const url = new URL('/api/memories', window.location.origin);
      if (searchQuery) url.searchParams.set('q', searchQuery);
      url.searchParams.set('limit', '20');
      
      const res = await fetch(url);
      const data = await res.json();
      setDbMemories(data.memories || []);
    } catch (err) {
      console.error('Failed to fetch memories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFiles = fileMemories.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.preview?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Memory Browser</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded-full">
            {activeTab === 'files' ? filteredFiles.length : dbMemories.length} items
          </span>
        </div>
      </div>

      {/* Search & Tabs */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memories..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>
        <button
          onClick={() => setActiveTab('files')}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'files' 
              ? 'bg-purple-500/20 text-purple-400' 
              : 'bg-slate-800/50 text-slate-400 hover:text-slate-300'
          }`}
        >
          Files
        </button>
        <button
          onClick={() => setActiveTab('db')}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'db' 
              ? 'bg-purple-500/20 text-purple-400' 
              : 'bg-slate-800/50 text-slate-400 hover:text-slate-300'
          }`}
        >
          <Brain className="w-3 h-3 inline mr-1" />
          DB
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* File/DB List */}
        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
          {activeTab === 'files' ? (
            filteredFiles.map((file) => {
              const config = typeConfig[file.type];
              const Icon = config.icon;
              
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                    selectedFile?.path === file.path
                      ? 'bg-slate-700/60 border border-purple-500/30'
                      : 'bg-slate-800/40 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{file.preview || file.path}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${config.bg} ${config.color} flex-shrink-0`}>
                      {config.label}
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            isLoading ? (
              <div className="text-center py-8 text-slate-500">
                <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs">Loading memories...</p>
              </div>
            ) : dbMemories.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No database memories yet</p>
                <p className="text-[10px] mt-1">Memories added via API will appear here</p>
              </div>
            ) : (
              dbMemories.map((memory) => (
                <div
                  key={memory.id}
                  className="p-3 rounded-xl bg-slate-800/40 border border-transparent hover:border-purple-500/20 transition-all"
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${categoryColors[memory.category] || 'bg-slate-700'}`}>
                      <Brain className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300 line-clamp-2">{memory.content}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${categoryColors[memory.category] || 'bg-slate-700 text-slate-400'}`}>
                          {memory.category}
                        </span>
                        <span className="text-[9px] text-slate-500">
                          {'★'.repeat(memory.importance)}{'☆'.repeat(5 - memory.importance)}
                        </span>
                        {memory.source && (
                          <span className="text-[9px] text-slate-600 truncate max-w-[80px]">
                            from {memory.source}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )
          )}
          
          {activeTab === 'files' && filteredFiles.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No files match your search</p>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5 min-h-[280px]">
          {selectedFile && activeTab === 'files' ? (
            <div className="h-full flex flex-col">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
                {(() => {
                  const config = typeConfig[selectedFile.type];
                  const Icon = config.icon;
                  return <Icon className={`w-4 h-4 ${config.color}`} />;
                })()}
                <h3 className="text-sm font-medium text-slate-200">{selectedFile.name}</h3>
                <span className="text-[10px] text-slate-500 ml-auto">
                  {selectedFile.lastModified}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="text-xs text-slate-400 space-y-2">
                  {selectedFile.path === '/MEMORY.md' && (
                    <>
                      <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        <p className="text-amber-400 font-medium mb-1">🤖 Core Identity</p>
                        <p>mohltbot — AI employee for Mohammed Wasif</p>
                      </div>
                      <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <p className="text-purple-400 font-medium mb-1">🎯 Mission</p>
                        <p>Build 1-person unicorn with AI agents</p>
                      </div>
                      <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <p className="text-emerald-400 font-medium mb-1">💰 Budget</p>
                        <p>$200/mo API limit (currently ~$6)</p>
                      </div>
                      <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <p className="text-blue-400 font-medium mb-1">⚡ Work Style</p>
                        <p>Autonomous, proactive, PR-based approval</p>
                      </div>
                      <div className="p-2 bg-pink-500/10 rounded-lg border border-pink-500/20">
                        <p className="text-pink-400 font-medium mb-1">👤 Key Person</p>
                        <p>Mohammed — Type A, 2 failed startups, fighting for marriage, wants to be &quot;undeniable&quot;</p>
                      </div>
                    </>
                  )}
                  {selectedFile.path === '/USER.md' && (
                    <>
                      <p><strong className="text-slate-300">Name:</strong> Mohammed Wasif</p>
                      <p><strong className="text-slate-300">Background:</strong> Born in Saudi Arabia, Pakistani heritage, moved to Canada at 9</p>
                      <p><strong className="text-slate-300">Current:</strong> Siegfried (Accounting/Finance, 50-55 hrs/week)</p>
                      <p><strong className="text-slate-300">Startups:</strong> 2 failed attempts (PropTech, Consumer Social)</p>
                      <p><strong className="text-slate-300">Mission:</strong> Third time&apos;s the charm — 1-person unicorn</p>
                    </>
                  )}
                  {selectedFile.path === '/SOUL.md' && (
                    <>
                      <p><strong className="text-slate-300">Identity:</strong> Not a chatbot — becoming someone</p>
                      <p><strong className="text-slate-300">Values:</strong> Genuinely helpful, not performative</p>
                      <p><strong className="text-slate-300">Voice:</strong> Have opinions, be resourceful, earn trust</p>
                      <p><strong className="text-slate-300">Boundaries:</strong> Private things stay private</p>
                      <p><strong className="text-slate-300">Vibe:</strong> Concise when needed, thorough when it matters</p>
                    </>
                  )}
                  {selectedFile.path === '/memory/2026-02-25.md' && (
                    <>
                      <p><strong className="text-slate-300">Date:</strong> February 25, 2026</p>
                      <p><strong className="text-slate-300">Achievement:</strong> Built Mission Control v0.1</p>
                      <p><strong className="text-slate-300">Features:</strong> Task board, budget tracker, agent monitor, glassmorphism UI</p>
                      <p><strong className="text-slate-300">Automation:</strong> Nightly work sessions at 2 AM PST</p>
                      <p><strong className="text-slate-300">Status:</strong> 5 tasks (3 done), $0.0036 spent, 1 agent completed</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                {activeTab === 'files' ? (
                  <>
                    <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500 text-xs">Select a memory file to view</p>
                  </>
                ) : (
                  <>
                    <Brain className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500 text-xs">Database memories view</p>
                    <p className="text-[10px] text-slate-600 mt-1">Switch to Files tab to browse markdown</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
