import { useState, useRef, useCallback, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  description: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
}

const defaultAgents: Agent[] = [
  { id: 'a1', name: 'Thingsboard Bot', description: 'IoT device management & telemetry' },
  { id: 'a2', name: 'BDA Sales Bot', description: 'Leads, targets & revenue tracking' },
];

const FILE_TYPES = ['PDF', 'DOCX', 'ZIP', 'CSV', 'Images', 'HTML', 'JSON', 'TAR'] as const;

const FILE_TYPE_COLORS: Record<string, string> = {
  PDF: 'text-rose-600 border-rose-300 dark:border-rose-700/60 dark:text-rose-400',
  DOCX: 'text-blue-600 border-blue-300 dark:border-blue-700/60 dark:text-blue-400',
  ZIP: 'text-amber-600 border-amber-300 dark:border-amber-700/60 dark:text-amber-400',
  CSV: 'text-emerald-600 border-emerald-300 dark:border-emerald-700/60 dark:text-emerald-400',
  Images: 'text-purple-600 border-purple-300 dark:border-purple-700/60 dark:text-purple-400',
  HTML: 'text-orange-600 border-orange-300 dark:border-orange-700/60 dark:text-orange-400',
  JSON: 'text-cyan-600 border-cyan-300 dark:border-cyan-700/60 dark:text-cyan-400',
  TAR: 'text-zinc-500 border-zinc-300 dark:border-zinc-600 dark:text-zinc-400',
};

const PROMPT_MAX = 2000;

function IconUpload({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  );
}

function IconFile({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function IconArrow({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

function IconPlus({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function IconLink({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function IconText({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  );
}

function IconPencil({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
    </svg>
  );
}

function IconTrash({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}

function AgentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  );
}

export default function TopicsSection() {
  const [agents, setAgents] = useState<Agent[]>(defaultAgents);
  const [selectedId, setSelectedId] = useState('a1');

  // Add-agent form
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentDesc, setNewAgentDesc] = useState('');

  // Edit agent
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [editAgentName, setEditAgentName] = useState('');
  const [editAgentDesc, setEditAgentDesc] = useState('');

  // Delete agent
  const [deletingAgent, setDeletingAgent] = useState<Agent | null>(null);

  // Data source panel
  const [dataTab, setDataTab] = useState<'files' | 'url' | 'text'>('files');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    { id: 'f1', name: 'zigxo steps.docx', size: '24 KB' },
  ]);
  const [pendingFiles, setPendingFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlFetched, setUrlFetched] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [textSaved, setTextSaved] = useState(false);

  // Instruction set panel
  const [instructionTab, setInstructionTab] = useState<'prompt' | 'references'>('prompt');
  const [systemPromptEnabled, setSystemPromptEnabled] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [conversationStartersEnabled, setConversationStartersEnabled] = useState(false);
  const [starterInput, setStarterInput] = useState('');
  const [starters, setStarters] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedAgent = agents.find((a) => a.id === selectedId)!;

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const next = Array.from(e.dataTransfer.files).map((f) => ({
      id: `f-${Date.now()}-${Math.random()}`,
      name: f.name,
      size: f.size > 1048576 ? `${(f.size / 1048576).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`,
    }));
    setPendingFiles((prev) => [...prev, ...next]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const next = Array.from(e.target.files).map((f) => ({
      id: `f-${Date.now()}-${Math.random()}`,
      name: f.name,
      size: f.size > 1048576 ? `${(f.size / 1048576).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`,
    }));
    setPendingFiles((prev) => [...prev, ...next]);
    e.target.value = '';
  };

  const handleUpload = () => { setUploadedFiles((prev) => [...prev, ...pendingFiles]); setPendingFiles([]); };

  const handleFetchUrl = () => {
    if (!urlInput.trim()) return;
    setUrlFetched(true);
    setTimeout(() => setUrlFetched(false), 2000);
  };

  const handleSaveText = () => {
    if (!textContent.trim()) return;
    setTextSaved(true);
    setTimeout(() => setTextSaved(false), 2000);
  };

  const handleAddAgent = () => {
    if (!newAgentName.trim()) return;
    const a: Agent = { id: `a-${Date.now()}`, name: newAgentName.trim(), description: newAgentDesc.trim() || 'Custom agent' };
    setAgents((prev) => [...prev, a]);
    setSelectedId(a.id);
    setNewAgentName('');
    setNewAgentDesc('');
    setShowAddAgent(false);
  };

  const handleAddStarter = () => {
    if (!starterInput.trim()) return;
    setStarters((prev) => [...prev, starterInput.trim()]);
    setStarterInput('');
  };

  const handleSaveInstructions = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handleReset = () => { setSystemPrompt(''); setSystemPromptEnabled(false); setConversationStartersEnabled(false); setStarters([]); setStarterInput(''); };

  const openEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setEditAgentName(agent.name);
    setEditAgentDesc(agent.description);
  };

  const saveEditAgent = () => {
    if (!editingAgent) return;
    setAgents((prev) => prev.map((a) => a.id === editingAgent.id ? { ...a, name: editAgentName.trim() || a.name, description: editAgentDesc.trim() } : a));
    setEditingAgent(null);
  };

  const confirmDeleteAgent = () => {
    if (!deletingAgent) return;
    const remaining = agents.filter((a) => a.id !== deletingAgent.id);
    setAgents(remaining);
    if (selectedId === deletingAgent.id) setSelectedId(remaining[0]?.id ?? '');
    setDeletingAgent(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setEditingAgent(null); setDeletingAgent(null); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="space-y-4 relative">
      {/* ── Agent selection cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {agents.map((agent) => {
          const isSelected = selectedId === agent.id;
          return (
            <div key={agent.id} className="relative group/card">
              <button
                onClick={() => setSelectedId(agent.id)}
                className={`relative w-full text-left p-4 rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-500/10 shadow-sm'
                    : 'border-zinc-200/60 dark:border-zinc-700/50 bg-white/60 dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-sm'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center shadow-sm select-none">✓</span>
                )}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${isSelected ? 'bg-indigo-100 dark:bg-indigo-500/20' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
                  <AgentIcon className={`w-5 h-5 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500 dark:text-zinc-400'}`} />
                </div>
                <p className={`text-sm font-semibold truncate leading-snug pr-6 ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-zinc-800 dark:text-zinc-100'}`}>{agent.name}</p>
                {agent.description && (
                  <p className={`text-[11px] mt-0.5 truncate ${isSelected ? 'text-indigo-500 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'}`}>{agent.description}</p>
                )}
              </button>

              {/* Edit / Delete actions — shown on hover */}
              <div className="absolute bottom-2 right-2 flex gap-0.5 opacity-0 group-hover/card:opacity-100 pointer-events-none group-hover/card:pointer-events-auto transition-opacity duration-150 z-10">
                <button
                  onClick={() => openEditAgent(agent)}
                  title="Edit agent"
                  className="p-1 rounded-md text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                >
                  <IconPencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeletingAgent(agent)}
                  title="Delete agent"
                  className="p-1 rounded-md text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                >
                  <IconTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Add New Agent */}
        {!showAddAgent ? (
          <button
            onClick={() => setShowAddAgent(true)}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-[1.5px] border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-200 min-h-[108px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <IconPlus className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">Add New Agent</span>
          </button>
        ) : (
          <div className="p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-700/50 bg-white/60 dark:bg-zinc-900/40 space-y-2.5">
            <input
              value={newAgentName}
              onChange={(e) => setNewAgentName(e.target.value)}
              placeholder="Agent name"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAddAgent()}
              className="w-full text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <textarea
              value={newAgentDesc}
              onChange={(e) => setNewAgentDesc(e.target.value)}
              placeholder="Short description (optional)"
              rows={2}
              className="w-full text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
            <div className="flex gap-2">
              <button onClick={handleAddAgent} className="text-xs font-semibold text-white bg-indigo-600 px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-colors duration-150">Create</button>
              <button onClick={() => { setShowAddAgent(false); setNewAgentName(''); setNewAgentDesc(''); }} className="text-xs font-semibold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors duration-150">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Configure panel ── */}
      <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border-[0.5px] border-zinc-200/50 dark:border-zinc-800/40 rounded-xl shadow-sm overflow-hidden">
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <AgentIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Configure</p>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">{selectedAgent.name}</p>
              {selectedAgent.description && <p className="text-xs text-zinc-400 dark:text-zinc-500">{selectedAgent.description}</p>}
            </div>
          </div>
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-700 dark:hover:bg-white transition-colors duration-150">
            <AgentIcon className="w-3.5 h-3.5" />
            {selectedAgent.name}
          </button>
        </div>

        {/* Two-column body */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-100 dark:divide-zinc-800/70">

          {/* ── Left: Upload data source ── */}
          <div className="p-6 space-y-4">
            <div>
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">Upload data source</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Files attached to this agent</p>
            </div>

            {/* Source tabs */}
            <div className="flex gap-0.5 p-0.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-lg w-fit border border-zinc-200/60 dark:border-zinc-700/50">
              <button
                onClick={() => setDataTab('files')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${dataTab === 'files' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'}`}
              >
                <IconFile className="w-3.5 h-3.5" /> Files
              </button>
              <button
                onClick={() => setDataTab('url')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${dataTab === 'url' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'}`}
              >
                <IconLink className="w-3.5 h-3.5" /> URL
              </button>
              <button
                onClick={() => setDataTab('text')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${dataTab === 'text' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'}`}
              >
                <IconText className="w-3.5 h-3.5" /> Text
              </button>
            </div>

            {/* ── FILES tab ── */}
            {dataTab === 'files' && (
              <>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-default ${isDragging ? 'border-indigo-400 bg-indigo-50/70 dark:bg-indigo-500/10' : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'}`}
                >
                  <div className={`w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center transition-colors duration-200 ${isDragging ? 'bg-indigo-100 dark:bg-indigo-500/20' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
                    <IconUpload className={`w-5 h-5 transition-colors duration-200 ${isDragging ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400'}`} />
                  </div>
                  <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-1">{isDragging ? 'Drop to add files' : 'Drag & drop files here'}</p>
                  <button onClick={() => fileInputRef.current?.click()} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">browse from your computer</button>
                  <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
                  <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                    {FILE_TYPES.map((ft) => (
                      <span key={ft} className={`text-[10px] font-semibold border rounded-full px-2 py-0.5 ${FILE_TYPE_COLORS[ft]}`}>{ft}</span>
                    ))}
                  </div>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-2">Max 50 MB</p>
                </div>

                {pendingFiles.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2">Queued ({pendingFiles.length})</p>
                    <div className="space-y-1.5">
                      {pendingFiles.map((f) => (
                        <div key={f.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-amber-50/60 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-700/40 group">
                          <div className="flex items-center gap-2 min-w-0"><IconFile className="w-3.5 h-3.5 text-amber-500 shrink-0" /><span className="text-xs font-medium text-zinc-700 dark:text-zinc-200 truncate">{f.name}</span></div>
                          <div className="flex items-center gap-2 ml-2 shrink-0">
                            <span className="text-[11px] text-zinc-400">{f.size}</span>
                            <button onClick={() => setPendingFiles((p) => p.filter((x) => x.id !== f.id))} className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-rose-500 transition-all duration-150"><IconX className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2">{uploadedFiles.length > 0 ? `Uploaded (${uploadedFiles.length})` : 'Uploaded'}</p>
                  {uploadedFiles.length > 0 ? (
                    <div className="space-y-1.5">
                      {uploadedFiles.map((f) => (
                        <div key={f.id} className="flex items-center justify-between py-2 px-3 rounded-lg border border-zinc-200/60 dark:border-zinc-700/50 group hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors duration-150">
                          <div className="flex items-center gap-2 min-w-0"><IconFile className="w-3.5 h-3.5 text-zinc-400 shrink-0" /><span className="text-xs font-medium text-zinc-700 dark:text-zinc-200 truncate">{f.name}</span></div>
                          <div className="flex items-center gap-2 ml-2 shrink-0">
                            <span className="text-[11px] text-zinc-400">{f.size}</span>
                            <button onClick={() => setUploadedFiles((p) => p.filter((x) => x.id !== f.id))} className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-rose-500 transition-all duration-150" title="Remove"><IconX className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 italic py-2">No files added yet</p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/60">
                  <button onClick={() => setPendingFiles([])} disabled={pendingFiles.length === 0} className="px-4 py-2 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150">Clear all</button>
                  <button onClick={handleUpload} disabled={pendingFiles.length === 0} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150">Upload <IconArrow className="w-3.5 h-3.5" /></button>
                </div>
              </>
            )}

            {/* ── URL tab ── */}
            {dataTab === 'url' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-2">URL or Notion page link</label>
                  <input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFetchUrl()}
                    placeholder="https://notion.so/... or any URL"
                    className="w-full text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow duration-150"
                  />
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1.5">Content will be fetched.</p>
                </div>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/50 rounded-lg px-3 py-2">
                  Public URLs only — pages behind login or authentication are not supported.
                </p>
                <div className="flex items-center gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/60">
                  <button onClick={() => setUrlInput('')} disabled={!urlInput} className="px-4 py-2 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150">Clear</button>
                  <button
                    onClick={handleFetchUrl}
                    disabled={!urlInput.trim()}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${urlFetched ? 'bg-emerald-600 text-white' : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-white'}`}
                  >
                    {urlFetched ? 'Fetched ✓' : <> Fetch URL <IconArrow className="w-3.5 h-3.5" /> </>}
                  </button>
                </div>
              </div>
            )}

            {/* ── TEXT tab ── */}
            {dataTab === 'text' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-2">Paste your content</label>
                  <textarea
                    rows={8}
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Paste any text content here..."
                    className="w-full text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-shadow duration-150 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                  />
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1.5">Plain text, markdown, or structured content — all accepted.</p>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/60">
                  <button onClick={() => setTextContent('')} disabled={!textContent} className="px-4 py-2 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150">Clear all</button>
                  <button
                    onClick={handleSaveText}
                    disabled={!textContent.trim()}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${textSaved ? 'bg-emerald-600 text-white' : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-white'}`}
                  >
                    {textSaved ? 'Saved ✓' : <> Upload <IconArrow className="w-3.5 h-3.5" /> </>}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Instruction set ── */}
          <div className="p-6 flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">Instruction set</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Define how this agent thinks and responds</p>
            </div>

            <div className="flex gap-0.5 p-0.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-lg w-fit border border-zinc-200/60 dark:border-zinc-700/50">
              {(['prompt', 'references'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setInstructionTab(tab)}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${instructionTab === tab ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'}`}
                >
                  {tab === 'references' ? 'Reference files' : 'Prompt'}
                </button>
              ))}
            </div>

            {instructionTab === 'prompt' && (
              <div className="flex flex-col gap-4 flex-1">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
                    <input type="checkbox" checked={systemPromptEnabled} onChange={(e) => setSystemPromptEnabled(e.target.checked)} className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer" />
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">System prompt</span>
                  </label>
                  <div className="relative">
                    <textarea
                      rows={7}
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value.slice(0, PROMPT_MAX))}
                      disabled={!systemPromptEnabled}
                      placeholder={`You are a helpful assistant for ${selectedAgent.name}. Answer only using uploaded documents. Always cite your sources…`}
                      className="w-full text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-2.5 pb-7 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                    />
                    <span className="absolute bottom-2.5 right-3 text-[11px] text-zinc-400 pointer-events-none">{systemPrompt.length} / {PROMPT_MAX}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
                    <input type="checkbox" checked={conversationStartersEnabled} onChange={(e) => setConversationStartersEnabled(e.target.checked)} className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer" />
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">Conversation starters</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={starterInput}
                      onChange={(e) => setStarterInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddStarter()}
                      disabled={!conversationStartersEnabled}
                      placeholder="e.g. What were Q3 sales targets?"
                      className="flex-1 text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow duration-150 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                    />
                    <button
                      onClick={handleAddStarter}
                      disabled={!conversationStartersEnabled || !starterInput.trim()}
                      className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
                    >
                      <IconPlus className="w-4 h-4" />
                    </button>
                  </div>
                  {starters.length > 0 && (
                    <div className="space-y-1.5">
                      {starters.map((s, i) => (
                        <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 group">
                          <span className="text-xs text-indigo-700 dark:text-indigo-300 font-medium truncate">{s}</span>
                          <button onClick={() => setStarters((p) => p.filter((_, j) => j !== i))} className="opacity-0 group-hover:opacity-100 ml-2 shrink-0 text-indigo-400 hover:text-rose-500 transition-all duration-150"><IconX className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-800/70">
                  <button onClick={handleReset} className="px-4 py-2 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-150">Reset</button>
                  <button
                    onClick={handleSaveInstructions}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${saved ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                  >
                    {saved ? 'Saved ✓' : <> Save instructions <IconArrow className="w-3.5 h-3.5" /> </>}
                  </button>
                </div>
              </div>
            )}

            {instructionTab === 'references' && (
              <div className="flex flex-col items-center justify-center flex-1 py-12 gap-3 text-center">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <IconFile className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Reference files</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Attach reference documents for this agent to cite</p>
                </div>
                <button className="mt-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Browse files</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Edit Agent Modal ─────────────────────────────────────────────────── */}
      {editingAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm" onClick={() => setEditingAgent(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-6">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Edit Agent</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Agent Name</label>
                <input
                  value={editAgentName}
                  onChange={(e) => setEditAgentName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEditAgent()}
                  autoFocus
                  className="w-full px-3 py-2 text-sm rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-700/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Description</label>
                <textarea
                  rows={2}
                  value={editAgentDesc}
                  onChange={(e) => setEditAgentDesc(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-700/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none transition"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2.5 mt-5">
              <button onClick={() => setEditingAgent(null)} className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200/70 dark:hover:bg-zinc-700/60 rounded-lg transition-colors">Cancel</button>
              <button onClick={saveEditAgent} className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Agent Modal ───────────────────────────────────────────────── */}
      {deletingAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm" onClick={() => setDeletingAgent(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-6">
            <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-500/15 flex items-center justify-center mb-4">
              <IconTrash className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">Delete Agent</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">{deletingAgent.name}</span>?{' '}
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2.5">
              <button onClick={() => setDeletingAgent(null)} className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200/70 dark:hover:bg-zinc-700/60 rounded-lg transition-colors">Cancel</button>
              <button onClick={confirmDeleteAgent} className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
