import React, { useState } from 'react';
import {
  Folder, FileCode, Copy, Check, Download, Search, Terminal,
  Layers, Cpu, Network, Palette, ShieldCheck, Box
} from 'lucide-react';
import { ANDROID_CODEBASE, CodeFile } from '../../data/androidCodebase';
import { ANDROID_SCREENS_CODEBASE } from '../../data/androidScreens';
import { generateAndroidProjectZip } from '../../utils/zipExport';

const ALL_CODE_FILES: CodeFile[] = [...ANDROID_CODEBASE, ...ANDROID_SCREENS_CODEBASE];

export const CodeExplorer: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>(ALL_CODE_FILES[0].path);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const selectedFile = ALL_CODE_FILES.find(f => f.path === selectedFilePath) || ALL_CODE_FILES[0];

  const filteredFiles = ALL_CODE_FILES.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsExporting(true);
      const blob = await generateAndroidProjectZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ImposterParty-Android-Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate ZIP', err);
    } finally {
      setIsExporting(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Files', count: ALL_CODE_FILES.length },
    { id: 'components', label: 'Compose UI', count: ALL_CODE_FILES.filter(f => f.category === 'components').length },
    { id: 'screens', label: 'Screens', count: ALL_CODE_FILES.filter(f => f.category === 'screens').length },
    { id: 'network', label: 'NSD & Sockets', count: ALL_CODE_FILES.filter(f => f.category === 'network').length },
    { id: 'viewmodel', label: 'ViewModels', count: ALL_CODE_FILES.filter(f => f.category === 'viewmodel').length },
    { id: 'di', label: 'Hilt DI', count: ALL_CODE_FILES.filter(f => f.category === 'di').length },
    { id: 'manifest', label: 'Manifest & Gradle', count: ALL_CODE_FILES.filter(f => ['manifest', 'gradle'].includes(f.category)).length }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0D1117] text-slate-100 overflow-hidden">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-800 bg-[#161B22]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100">Android Studio Kotlin Codebase</h1>
            <p className="text-xs text-slate-400">Production-ready Jetpack Compose, Hilt DI, NSD & Sockets</p>
          </div>
        </div>

        <button
          id="btn-download-project-zip"
          onClick={handleDownloadZip}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'Packaging ZIP...' : 'Download Android Studio Project (.ZIP)'}
        </button>
      </div>

      {/* Main Dual-Pane Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left File Tree & Category Explorer */}
        <div className="w-full md:w-80 border-r border-slate-800 bg-[#161B22]/70 flex flex-col">
          {/* Search box */}
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search Kotlin files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#0D1117] border border-slate-800 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex gap-1 overflow-x-auto p-2 border-b border-slate-800/80 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* File List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredFiles.map(file => {
              const isSelected = file.path === selectedFilePath;
              return (
                <button
                  key={file.path}
                  id={`codefile-${file.name.replace(/\./g, '-')}`}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 shadow-sm'
                      : 'border-transparent text-slate-400 hover:bg-[#21262D] hover:text-slate-200'
                  }`}
                >
                  <FileCode className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate text-slate-200">{file.name}</div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">{file.path}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="flex-1 flex flex-col bg-[#0D1117] overflow-hidden">
          {/* File Header Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#161B22] border-b border-slate-800">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-mono font-bold text-cyan-400">{selectedFile.name}</span>
              <span className="text-slate-600">|</span>
              <span className="text-xs text-slate-400 truncate">{selectedFile.description}</span>
            </div>

            <button
              id="btn-copy-kotlin-code"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Syntax Highlighted Code Viewer */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-200 bg-[#0D1117] selection:bg-cyan-500/30">
            <pre className="tab-4">
              <code>
                {selectedFile.content.split('\n').map((line, idx) => (
                  <div key={idx} className="flex hover:bg-slate-800/30 px-2 rounded">
                    <span className="w-10 select-none text-slate-600 text-right pr-4 flex-shrink-0 font-mono">
                      {idx + 1}
                    </span>
                    <span className="text-slate-300">{line || '\n'}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
