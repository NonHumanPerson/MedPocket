import React, { useState, useEffect } from 'react';
import {
  MEDGEMMA_MODEL_CATALOGUE,
  ModelTierDefinition,
  MedGemmaTierId,
  checkWebGpuSupport,
  getDeviceStorageEstimate,
  getDownloadedModelTiers,
  getLocalEngineSettings,
  saveLocalEngineSettings,
  pingOllamaServer,
  downloadManager,
  runLocalBenchmark,
  verifyModelInCache,
  ModelDownloadState,
} from '../services/localModelEngine';
import {
  Download,
  Trash2,
  CheckCircle2,
  Cpu,
  HardDrive,
  RefreshCw,
  Sparkles,
  Zap,
  Play,
  Server,
  ShieldCheck,
  Check,
  AlertCircle,
  Copy,
  ExternalLink,
  Layers,
} from 'lucide-react';

interface LocalModelStudioViewProps {
  onEngineChanged: (tierId: MedGemmaTierId) => void;
}

export const LocalModelStudioView: React.FC<LocalModelStudioViewProps> = ({
  onEngineChanged,
}) => {
  const [downloadedTiers, setDownloadedTiers] = useState<MedGemmaTierId[]>([]);
  const [activeTierId, setActiveTierId] = useState<MedGemmaTierId>('offline_db');
  const [downloadProgress, setDownloadProgress] = useState<Record<string, ModelDownloadState>>({});
  const [verifiedCaches, setVerifiedCaches] = useState<Record<string, boolean>>({});
  const [webGpuInfo, setWebGpuInfo] = useState<{ supported: boolean; adapterName?: string; error?: string }>({
    supported: false,
  });
  const [storageInfo, setStorageInfo] = useState({ quotaBytes: 0, usageBytes: 0, availableBytes: 0 });
  const [copiedOllamaCmd, setCopiedOllamaCmd] = useState(false);

  // Ollama local desktop runner state
  const [ollamaEndpoint, setOllamaEndpoint] = useState('http://localhost:11434');
  const [isPingingOllama, setIsPingingOllama] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<{ connected: boolean; models: string[]; error?: string }>({
    connected: false,
    models: [],
  });

  // Benchmark playground state
  const [benchmarkPrompt, setBenchmarkPrompt] = useState('Explain Metformin mechanism of action and lactic acidosis risk');
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkTokens, setBenchmarkTokens] = useState('');
  const [benchmarkStats, setBenchmarkStats] = useState<{ tokensGenerated: number; durationSeconds: number; tokensPerSec: number } | null>(null);

  useEffect(() => {
    checkWebGpuSupport().then(setWebGpuInfo);
    getDeviceStorageEstimate().then(setStorageInfo);
    const tiers = getDownloadedModelTiers();
    setDownloadedTiers(tiers);

    const settings = getLocalEngineSettings();
    setActiveTierId(settings.activeTierId);
    setOllamaEndpoint(settings.ollamaEndpoint);

    // Verify cache integrity for any downloaded tier
    tiers.forEach(async (id) => {
      const isCached = await verifyModelInCache(id);
      setVerifiedCaches((prev) => ({ ...prev, [id]: isCached }));
    });
  }, []);

  const handleStartDownload = (tier: ModelTierDefinition) => {
    downloadManager.startDownload(
      tier,
      (state) => {
        setDownloadProgress((prev) => ({ ...prev, [tier.id]: state }));
      },
      async () => {
        const updated = getDownloadedModelTiers();
        setDownloadedTiers(updated);
        const isCached = await verifyModelInCache(tier.id);
        setVerifiedCaches((prev) => ({ ...prev, [tier.id]: isCached }));
        setActiveTierId(tier.id);
        onEngineChanged(tier.id);
        getDeviceStorageEstimate().then(setStorageInfo);
      },
      (err) => {
        console.error('Download error:', err);
      }
    );
  };

  const handleDeleteModel = async (tierId: MedGemmaTierId) => {
    await downloadManager.deleteModel(tierId);
    const updated = getDownloadedModelTiers();
    setDownloadedTiers(updated);
    setVerifiedCaches((prev) => {
      const copy = { ...prev };
      delete copy[tierId];
      return copy;
    });
    setDownloadProgress((prev) => {
      const copy = { ...prev };
      delete copy[tierId];
      return copy;
    });
    const current = getLocalEngineSettings();
    setActiveTierId(current.activeTierId);
    onEngineChanged(current.activeTierId);
    getDeviceStorageEstimate().then(setStorageInfo);
  };

  const handleActivateTier = (tierId: MedGemmaTierId) => {
    const settings = getLocalEngineSettings();
    settings.activeTierId = tierId;
    saveLocalEngineSettings(settings);
    setActiveTierId(tierId);
    onEngineChanged(tierId);
  };

  const handlePingOllama = async () => {
    setIsPingingOllama(true);
    try {
      const res = await pingOllamaServer(ollamaEndpoint);
      setOllamaStatus(res);
      if (res.connected) {
        const settings = getLocalEngineSettings();
        settings.ollamaEndpoint = ollamaEndpoint;
        if (res.models.length > 0) {
          settings.selectedOllamaModel = res.models[0];
        }
        saveLocalEngineSettings(settings);
      }
    } finally {
      setIsPingingOllama(false);
    }
  };

  const handleCopyOllama = () => {
    navigator.clipboard.writeText('ollama run medgemma');
    setCopiedOllamaCmd(true);
    setTimeout(() => setCopiedOllamaCmd(false), 2000);
  };

  const handleRunBenchmark = async () => {
    if (!benchmarkPrompt.trim()) return;
    setIsBenchmarking(true);
    setBenchmarkTokens('');
    setBenchmarkStats(null);

    try {
      const stats = await runLocalBenchmark(activeTierId, benchmarkPrompt, (token) => {
        setBenchmarkTokens((prev) => prev + token);
      });
      setBenchmarkStats(stats);
    } finally {
      setIsBenchmarking(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Container */}
      <div className="p-7 sm:p-9 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-12 -right-12 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200/60 dark:border-teal-800/60 text-teal-800 dark:text-teal-300 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Open-Source MedGemma Architecture · Real On-Device Download & Storage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Download Open-Source MedGemma & Manage Local Models
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            Download open-source MedGemma weights directly into your browser’s persistent CacheStorage sandbox. Once downloaded, MedPocket scans prescription labels, transcribes clinical text via on-device OCR, and checks drug safety 100% offline with zero cloud transmission.
          </p>
        </div>
      </div>

      {/* Hardware & Storage Diagnostics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* WebGPU Status */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              WebGPU Tensor Acceleration
            </span>
            {webGpuInfo.supported ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/70 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3" /> Hardware GPU
              </span>
            ) : (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/70 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                CPU / WASM
              </span>
            )}
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white truncate">
            {webGpuInfo.supported ? (webGpuInfo.adapterName || 'Hardware GPU') : 'CPU / Software Core'}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {webGpuInfo.supported ? 'Direct tensor compute active for 2B and 4B models' : 'CPU fallback mode active for safe execution'}
          </p>
        </div>

        {/* Local Storage Sandbox */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Browser Storage Sandbox
            </span>
            <HardDrive className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-base font-bold font-mono text-slate-900 dark:text-white">
            {(storageInfo.availableBytes / (1024 * 1024 * 1024)).toFixed(1)} GB Available
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Persistent CacheStorage sandbox for offline model weights
          </p>
        </div>

        {/* Active Engine */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Clinical Engine
            </span>
            <Zap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-base font-bold text-teal-700 dark:text-teal-400 truncate">
            {activeTierId === 'tier1_2b'
              ? 'MedGemma 2B (Downloaded)'
              : activeTierId === 'tier2_4b'
              ? 'MedGemma 4B (Downloaded)'
              : activeTierId === 'tier3_9b_ollama'
              ? 'Ollama 9B/27B (Desktop)'
              : 'Clinical DB (Instant 0ms)'}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            100% on-device private execution
          </p>
        </div>
      </div>

      {/* Model Tier Catalogue */}
      <section className="space-y-4">
        <div className="px-1 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Open-Source MedGemma Model Catalogue
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Download and manage quantized open-source MedGemma checkpoints directly on this device:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {MEDGEMMA_MODEL_CATALOGUE.map((tier) => {
            const isInstalled = downloadedTiers.includes(tier.id);
            const isActive = activeTierId === tier.id;
            const progress = downloadProgress[tier.id];
            const isDownloading = progress?.status === 'downloading';
            const isVerified = verifiedCaches[tier.id];

            return (
              <div
                key={tier.id}
                className={`p-7 rounded-3xl transition-all shadow-xs border ${
                  isActive
                    ? 'bg-teal-50/60 dark:bg-teal-950/30 border-teal-500 dark:border-teal-500 ring-2 ring-teal-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Model Meta */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                        {tier.badge}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                        {tier.formattedSize}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Requires: {tier.minRamRequirement}
                      </span>
                      {isInstalled && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Installed & Cached Offline</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {tier.name}
                      </h3>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                        Repo: {tier.openSourceRepo} · Quantization: Q4
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {tier.tagline}
                    </p>

                    <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                      {tier.capabilities.map((cap, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>

                    {/* Manifest Files List */}
                    <div className="pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Open-Source Manifest Assets:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tier.manifestFiles.map((file, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            {file}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="lg:w-64 flex flex-col justify-between pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
                    {/* Tier 3: Ollama Desktop Runner */}
                    {tier.executionEnvironment === 'ollama' ? (
                      <div className="space-y-3">
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 dark:text-slate-200">Local Daemon</span>
                            <span className={`text-[10px] font-bold ${ollamaStatus.connected ? 'text-emerald-600' : 'text-slate-400'}`}>
                              {ollamaStatus.connected ? 'Connected' : 'Offline'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-[11px]">
                            <code>ollama run medgemma</code>
                            <button
                              onClick={handleCopyOllama}
                              className="text-teal-700 dark:text-teal-400 hover:text-teal-800 cursor-pointer"
                              title="Copy command"
                            >
                              {copiedOllamaCmd ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => handleActivateTier(tier.id)}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 touch-press ${
                            isActive
                              ? 'bg-teal-700 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {isActive ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Active Engine</span>
                            </>
                          ) : (
                            <span>Select Desktop Runner</span>
                          )}
                        </button>
                      </div>
                    ) : (
                      /* Tier 1 & 2: In-browser WebGPU download */
                      <div className="space-y-3">
                        {isDownloading && progress && (
                          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-teal-700 dark:text-teal-400">Downloading weights...</span>
                              <span className="font-mono">{progress.progressPercent}%</span>
                            </div>

                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-150"
                                style={{ width: `${progress.progressPercent}%` }}
                              />
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                              <span>{(progress.bytesLoaded / (1024 * 1024)).toFixed(0)} MB / {tier.formattedSize}</span>
                              <span>{progress.speedMbps} MB/s</span>
                            </div>

                            {progress.etaSeconds > 0 && (
                              <div className="text-[10px] text-slate-400">
                                Estimated time remaining: ~{progress.etaSeconds}s
                              </div>
                            )}

                            <button
                              onClick={() => downloadManager.cancelDownload(tier.id)}
                              className="text-[11px] text-rose-600 hover:underline cursor-pointer block pt-1 font-semibold"
                            >
                              Cancel Download
                            </button>
                          </div>
                        )}

                        {!isDownloading && isInstalled && (
                          <div className="space-y-2">
                            <button
                              onClick={() => handleActivateTier(tier.id)}
                              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 touch-press ${
                                isActive
                                  ? 'bg-teal-700 text-white shadow-xs'
                                  : 'bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 hover:bg-teal-100'
                              }`}
                            >
                              {isActive ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Active Engine</span>
                                </>
                              ) : (
                                <span>Activate Model</span>
                              )}
                            </button>

                            <button
                              onClick={() => handleDeleteModel(tier.id)}
                              className="w-full py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 touch-press font-semibold"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete ({tier.formattedSize})</span>
                            </button>
                          </div>
                        )}

                        {!isDownloading && !isInstalled && (
                          <button
                            onClick={() => handleStartDownload(tier)}
                            className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm touch-press"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download {tier.formattedSize}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tier 0: Built-in Instant Offline Clinical Core Card */}
      <div className={`p-7 rounded-3xl transition-all shadow-xs border ${
        activeTierId === 'offline_db'
          ? 'bg-teal-50/60 dark:bg-teal-950/30 border-teal-500 ring-2 ring-teal-500/20'
          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Tier 0 · Embedded Clinical Knowledge Core (Instant 0ms)
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Zero-download pharmaceutical database embedded directly in MedPocket. Instant responses with 50+ curated monographs, multi-drug interactions, and 3-tier side effects. Always available even with 0MB free storage.
            </p>
          </div>

          <button
            onClick={() => handleActivateTier('offline_db')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 touch-press ${
              activeTierId === 'offline_db'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {activeTierId === 'offline_db' ? 'Active Default' : 'Switch to Instant DB'}
          </button>
        </div>
      </div>

      {/* Local Ollama Desktop Runner Settings */}
      <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Desktop Runner Configuration (Ollama / LM Studio)
          </h3>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          If you have Ollama or llama-server running locally on your laptop, MedPocket connects directly to your local daemon port with zero external network traffic.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={ollamaEndpoint}
            onChange={(e) => setOllamaEndpoint(e.target.value)}
            placeholder="http://localhost:11434"
            className="flex-1 w-full px-4 h-12 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={handlePingOllama}
            disabled={isPingingOllama}
            className="w-full sm:w-auto px-6 h-12 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 touch-press shadow-xs shrink-0"
          >
            {isPingingOllama ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            <span>Test Connection</span>
          </button>
        </div>

        {ollamaStatus.connected ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Connected! Discovered models: {ollamaStatus.models.join(', ') || 'MedGemma Ready'}</span>
          </div>
        ) : ollamaStatus.error ? (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span>Tip: To permit browser connections, launch Ollama with CORS enabled: </span>
              <code className="bg-slate-200 dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded text-[11px] font-mono block mt-1">
                OLLAMA_ORIGINS="*" ollama serve
              </code>
            </div>
          </div>
        ) : null}
      </div>

      {/* Interactive Token Benchmark Playground */}
      <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Local Model Playground & Inference Benchmark
            </h3>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            Engine: {activeTierId}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300">
          Run a clinical prompt to benchmark tokens-per-second and verify on-device response latency:
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={benchmarkPrompt}
              onChange={(e) => setBenchmarkPrompt(e.target.value)}
              className="flex-1 px-4 h-12 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={handleRunBenchmark}
              disabled={isBenchmarking}
              className="px-6 h-12 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 touch-press shadow-xs shrink-0"
            >
              {isBenchmarking ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span>Benchmark</span>
            </button>
          </div>

          {/* Benchmark Results */}
          {benchmarkStats && (
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800 text-center">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Speed</span>
                <div className="text-lg font-extrabold font-mono text-teal-700 dark:text-teal-300">
                  {benchmarkStats.tokensPerSec} t/s
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Tokens</span>
                <div className="text-lg font-extrabold font-mono text-slate-900 dark:text-white">
                  {benchmarkStats.tokensGenerated}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Latency</span>
                <div className="text-lg font-extrabold font-mono text-slate-900 dark:text-white">
                  {benchmarkStats.durationSeconds.toFixed(2)}s
                </div>
              </div>
            </div>
          )}

          {benchmarkTokens && (
            <div className="p-5 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs whitespace-pre-wrap leading-relaxed shadow-inner border border-slate-800">
              {benchmarkTokens}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
