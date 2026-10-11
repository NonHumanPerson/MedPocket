# Agent Handover Dossier & Optimization Plan: MedPocket Offline MedGemma

A comprehensive architectural specification, codebase directory map, runtime state documentation, and optimization roadmap prepared for an incoming coding agent to continue advancing offline MedGemma model downloads and on-device vision scanning.

***

## User Review & Critical Decisions

> [!IMPORTANT]
> The incoming coding agent should review these confirmed choices and priority targets before modifying the codebase.

- **Confirmed Decision 1 (Handover Scope)**: Comprehensive architectural blueprint, complete codebase directory and module mapping, persistent offline storage structure, and current feature state analysis.
- **Confirmed Decision 2 (Primary Optimization Objective)**: Continue optimizing the on-device open-source MedGemma model download pipeline, in-browser CacheStorage/IndexedDB persistence, and real-time offline OCR scanning accuracy.
- **Open Architecture Decision for Next Agent**: Upgrading the WebGPU shader runtime from simulated progressive tensor compute to full in-browser `@huggingface/transformers` or WebLLM ONNX/GGUF runtime kernels for true generative token streaming on desktop/mobile WebGPU.

***

## 1. Overview & Core Concept

- **Application Purpose**: **MedPocket** is a sovereign, offline-first clinical medication intelligence application and safety vault. It provides instant pharmacological monograph lookups, multi-drug pairwise interaction checks, and camera/upload-based prescription label scanning powered by open-source **MedGemma** foundation model weights.
- **Key Tenet**: Zero cloud retention. All prescription labels, patient cabinet medications, and consultation queries can execute 100% locally on-device without internet or API key requirements.
- **Target Audience**: Patients managing complex medication regimens, elderly users taking multiple concurrent prescriptions, and clinicians needing zero-latency offline interaction checks in air-gapped or low-connectivity environments.

***

## 2. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT BROWSER (PWA)                            │
│                                                                             │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────┐  │
│  │   SearchLookupView    │  │      CabinetView      │  │ InteractionView │  │
│  │ (Monographs, Fast DB) │  │ (Daily Adherence/List)│  │ (Pairwise Risk) │  │
│  └───────────┬───────────┘  └───────────┬───────────┘  └────────┬────────┘  │
│              │                          │                       │           │
│  ┌───────────┴──────────────────────────┴───────────────────────┴────────┐  │
│  │                 CameraScannerModal (Prescription OCR)                 │  │
│  │   • Live WebRTC Camera Stream / File Upload / Sample Label Canvas     │  │
│  │   • Canvas 2D Pre-Processing (Contrast Boost & Adaptive Binarize)     │  │
│  │   • Tesseract.js WebAssembly / Web Worker OCR Engine                  │  │
│  │   • MedGemma Entity Extractor & Cabinet Clashes Checker               │  │
│  └──────────────────────────────────────┬────────────────────────────────┘  │
│                                         │                                   │
│  ┌──────────────────────────────────────┴────────────────────────────────┐  │
│  │               LocalModelStudioView (Weight & Cache Manager)           │  │
│  │   • Tier 1: MedGemma 2B Mobile Lite (1.2 GB, WebGPU INT4)            │  │
│  │   • Tier 2: MedGemma 4B Clinical Standard (2.6 GB, Multimodal INT4)   │  │
│  │   • Tier 3: MedGemma 9B Clinical Pro (Ollama / GGUF Desktop Daemon)   │  │
│  │   • Tier 0: Embedded Clinical Knowledge Core (Instant 0ms Fallback)   │  │
│  └───────────┬──────────────────────────────────────────┬────────────────┘  │
│              │                                          │                   │
│  ┌───────────▼───────────┐                  ┌───────────▼────────────────┐  │
│  │  Browser Storage APIs │                  │   Server-Side Proxy API    │  │
│  │ • CacheStorage        │                  │   (server.ts / Express)    │  │
│  │ • IndexedDB           │                  │ • /api/medgemma/explain    │  │
│  │ • localStorage        │                  │ • /api/medgemma/analyze    │  │
│  │ • WebGPU Device       │                  │ • /api/medgemma/interact   │  │
│  └───────────────────────┘                  └───────────┬────────────────┘  │
└─────────────────────────────────────────────────────────┼───────────────────┘
                                                          │ (Optional Online)
                                              ┌───────────▼────────────────┐
                                              │   Google Gemini API SDK    │
                                              │     (gemini-3.8-flash)     │
                                              └────────────────────────────┘
```

### Complete Codebase Map & Module Responsibilities

```
/
├── server.ts                    # Express backend serving static dist / Vite dev middleware,
│                                # handles optional Gemini 3.8 Flash server proxies.
├── package.json                 # React 19, Vite, Tailwind v4, Tesseract.js, Lucide-React.
├── metadata.json                # Project branding, camera permissions, capabilities.
├── index.html                   # Entry point with SEO tags, typography fonts, PWA manifest.
│
├── src/
│   ├── main.tsx                 # React DOM mount point.
│   ├── App.tsx                  # Root state orchestration (tabs, cabinet, modals, engine tier).
│   ├── index.css                # Global Tailwind CSS and laser-scan animations.
│   │
│   ├── types/
│   │   └── medication.ts        # TypeScript contracts: MedicationMonograph, UserCabinetItem,
│   │                            # InteractionCheckResult, MedGemmaAnalysisResult.
│   │
│   ├── data/
│   │   └── clinicalDatabase.ts  # Curated offline database of 50+ clinical drug monographs
│   │                            # with mechanisms, 3-tier side effects, black-box warnings.
│   │
│   ├── services/
│   │   ├── localModelEngine.ts  # Model download manager, CacheStorage persistence,
│   │   │                        # Tesseract OCR engine, canvas pre-processor, entity extractor,
│   │   │                        # WebGPU check, and Ollama desktop connector.
│   │   ├── interactionEngine.ts # Deterministic pairwise drug interaction evaluation algorithm.
│   │   └── storageService.ts    # localStorage cabinet management and privacy vault settings.
│   │
│   └── components/
│       ├── TopBar.tsx               # Header nav, active engine badge, scan button.
│       ├── CameraScannerModal.tsx   # Prescription camera scanner, OCR progress,
│       │                            # detailed results, cabinet clash alerts, raw OCR viewer.
│       ├── LocalModelStudioView.tsx # Download progress bars, cache verification,
│       │                            # Ollama endpoint test, token benchmark playground.
│       ├── CabinetView.tsx          # User's personal drug cabinet, daily dosage adherence.
│       ├── SearchLookupView.tsx     # Drug monograph search and filtering engine.
│       ├── InteractionMatrixView.tsx# Pairwise drug-drug risk matrix and guidance.
│       ├── MedicineDetailModal.tsx  # Deep monograph inspector and Q&A dialog.
│       ├── PrivacyVaultView.tsx     # Air-gap mode toggles and client data purge.
│       └── OfflineIndicator.tsx     # Live online/offline/air-gap network badge.
```

***

## 3. Current Implementation State

1. **Model Download & Storage Engine (`localModelEngine.ts`)**:
   - Supports 4 tiers: MedGemma 2B, MedGemma 4B, MedGemma 9B (Ollama), and Tier 0 (Embedded Core).
   - `ModelDownloadManager` implements chunked progressive streaming with live throughput calculation (MB/s), bytes loaded, progress percentage, and time remaining (ETA).
   - Writes verified model manifests and tensor weight headers to persistent browser `CacheStorage` (`caches.open('medpocket-medgemma-cache-v1')`).
   - Supports download cancellation, cache verification (`verifyModelInCache`), and deletion to free disk space.
   - Live Ollama REST API pinging (`pingOllamaServer`) on `http://localhost:11434` with model discovery.

2. **On-Device OCR & Vision Scanner (`CameraScannerModal.tsx`)**:
   - Features 3 input modes: WebRTC live camera capture with laser alignment overlay, file upload (JPG/PNG/WEBP), and instant high-contrast sample pharmacy labels.
   - Canvas-based image pre-processing (`preprocessImageForOcr`) boosts contrast by +35% and normalizes luminance before character recognition.
   - Powered by `tesseract.js` in a browser WebWorker for pure on-device optical transcription.
   - `extractMedicationEntitiesFromText` identifies drug names, dosage forms, strengths, Sig instructions, and warnings.
   - Cross-checks scanned medicines against `cabinetItems` to flag dangerous contraindications immediately.
   - Expandable Raw OCR Inspector displays transcribed text with a copy button.
   - Interactive "Ask Offline MedGemma" consultation panel handles common questions (e.g. coffee, missed dose, exercise, alcohol).

3. **Compilation & Stability**:
   - Fully typed TypeScript codebase with zero errors (`npm run lint` and `npm run build` pass cleanly).
   - Runs on port 3000 via `server.ts`.

***

## 4. Key Roadmap & Tasks for the Next Coding Agent

The next coding agent should focus on the following high-impact optimizations:

### Priority 1: True ONNX / WebGPU Shader Inference Runtime
- Currently, WebGPU execution simulates progressive tensor tokens while relying on the curated clinical entity matrix.
- **Goal**: Integrate `@huggingface/transformers` or `onnxruntime-web` to load actual quantized Gemma/MedGemma ONNX or WebLLM weights directly into GPU memory buffers (`device.createBuffer`) for authentic local generative token generation on supported GPUs.

### Priority 2: OCR Accuracy & Bounding Box Visualization
- Upgrade `CameraScannerModal` to render bounding boxes over detected text tokens (e.g., highlighting where the medication name and strength were detected on the video preview canvas).
- Add automatic perspective correction (quadrilateral deskewing) for prescription bottles held at acute angles.

### Priority 3: Offline Barcode & NDC Code Lookup
- Integrate `BarcodeDetector` API (or `html5-qrcode` / `@zxing/library`) to read 1D NDC barcodes and 2D DataMatrix pharmacy codes directly from medication packages.
- Map National Drug Codes (NDCs) directly to the clinical database for 100% deterministic accuracy alongside optical OCR.

### Priority 4: Background Cache Worker & PWA Asset Prefetching
- Configure service worker pre-caching for `tesseract.js` language assets (`eng.traineddata.gz`) so first-time offline scans work even if the user never opened the camera while connected.
- Implement Origin Private File System (OPFS) support alongside `CacheStorage` for large multi-gigabyte GGUF shards.
