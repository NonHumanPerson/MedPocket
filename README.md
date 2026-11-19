# MedPocket — Clinical Medication Intelligence

**Offline-first medication explainer, interaction checker, and Ayurvedic perspective — India-focused, privacy-first.**

[![Build Android](https://github.com/USERNAME/MedPocket/actions/workflows/build-android.yml/badge.svg)](https://github.com/USERNAME/MedPocket/actions/workflows/build-android.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Flutter](https://img.shields.io/badge/Flutter-3.19-blue)](https://flutter.dev)

## 📱 Overview

MedPocket is an **offline-first** Android app that helps you:
- **Identify medicines** by scanning labels/prescriptions (on-device OCR)
- **Learn about medications** — uses, dosage, side effects, warnings, interactions
- **Track your medicines** in a personal cabinet with dose reminders
- **Check drug-drug interactions** before combining medications
- **Explore Ayurvedic perspectives** (literature-sourced, evidence-graded, pending expert review)

**No account required. No health data leaves your device. Works completely offline.**

---

## ⚠️ Critical Disclaimers

> **This app is for informational/educational purposes only. It does NOT provide medical advice, diagnosis, or treatment recommendations.**

- **Never stop or change prescribed medication** without consulting your physician or pharmacist
- **Ayurvedic information is literature-sourced and PENDING EXPERT REVIEW** — not verified medical recommendations
- Drug interactions may not capture all possible combinations
- Individual responses to medications vary significantly
- In a medical emergency, contact emergency services immediately

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Offline Database** | ~100 essential medicines (NLEM 2022 + WHO EML 2023) with full monographs |
| **Label Scanner** | Camera → OCR → medicine identification (on-device, no cloud) |
| **Medicine Cabinet** | Add medicines, track doses, mark as taken |
| **Interaction Checker** | Offline drug-drug interaction analysis with severity grading |
| **Ayurvedic Perspective** | Traditional formulations mapped to modern drugs, evidence-graded (A–D) |
| **Bilingual** | English + Hindi (Devanagari) |
| **Air-Gap Mode** | Disable all network requests; 100% offline |
| **Privacy-First** | No accounts, no cloud sync, no analytics, no tracking |

---

## 📥 Installation

### From GitHub Releases (Recommended)

1. Go to [Releases](https://github.com/USERNAME/MedPocket/releases)
2. Download the APK for your device architecture:
   - `app-arm64-v8a-release.apk` — most modern phones (64-bit ARM)
   - `app-armeabi-v7a-release.apk` — older 32-bit ARM devices
   - `app-x86_64-release.apk` — emulators
3. Enable "Install from unknown sources" in Android Settings → Security
4. Install the APK

### From Source

```bash
# Prerequisites: Flutter 3.19+, Android SDK
cd apps/mobile
flutter pub get
dart run build_runner build --delete-conflicting-outputs
flutter build apk --release --split-per-abi
```

---

## 🏗️ Architecture

```
apps/mobile/
├── lib/
│   ├── main.dart                    # App entry point
│   ├── src/
│   │   ├── core/
│   │   │   ├── models/              # Freezed data models (Medication, Ayurveda, Cabinet)
│   │   │   ├── services/            # DataLoader, InteractionChecker, OCR, MedicationService
│   │   ├── features/
│   │   │   ├── home/                # Main navigation (5 tabs)
│   │   │   ├── search/              # Search + scan screen
│   │   │   ├── cabinet/             # Personal medicine cabinet
│   │   │   ├── interactions/        # Drug interaction checker
│   │   │   ├── ayurveda/            # Ayurvedic mappings browser
│   │   │   ├── settings/            # Language, theme, privacy, legal
│   │   │   └── medication_detail/   # Full monograph view
│   │   └── shared/
│   │       ├── widgets/             # Reusable UI components
│   │       └── utils/               # Theme, localizations
├── assets/
│   ├── data/                        # Generated JSON (medications.json, ayurveda.json)
│   └── translations/                # ARB files (future)
├── android/                         # Android project
└── pubspec.yaml
```

### Data Pipeline

```
tools/data_generator/generate_data.py
    │
    ├── Authoritative sources (NLEM, WHO EML, API, CCRAS, PubMed)
    │
    ▼
Versioned JSON assets (apps/mobile/assets/data/)
    ├── medications.json    — 15+ modern drug monographs
    └── ayurveda.json       — 17 evidence-graded Ayurvedic mappings
```

---

## 🌿 Ayurvedic Information — Evidence Grading

| Grade | Meaning | Sources |
|-------|---------|---------|
| **A** | Systematic review / RCT | Peer-reviewed clinical trials |
| **B** | Small clinical studies | Pilot trials, observational studies |
| **C** | Classical texts / preclinical | Ayurvedic Pharmacopoeia, animal models |
| **D** | Anecdotal / traditional use | Classical texts only |

**Every entry is badged: "Literature-sourced, pending expert review" — NOT verified.**

---

## 🛡️ Safety Features

- **Narrow Therapeutic Index (NTI) drugs** flagged: warfarin, insulin, lithium, digoxin, antiepileptics, transplant meds
- **Hard interaction warnings** for NTI combinations
- **Herb-drug interaction cross-check** against cabinet
- **No substitution language** — Ayurvedic info framed as "traditional use information"
- **Pregnancy/black-box warnings** from modern monographs carried forward

---

## 📦 Data Sources & Attribution

### Modern Medications
- National List of Essential Medicines (NLEM) 2022, MoHFW, Govt of India
- WHO Model List of Essential Medicines, 23rd List (2023)
- Indian Pharmacopoeia 2018, IPC
- DailyMed / MedlinePlus (NLM, Public Domain)
- ATC/DDD Index (WHO)
- RxNorm (NLM, Public Domain)

### Ayurvedic Information
- Ayurvedic Pharmacopoeia of India, Part I & II, Ministry of AYUSH
- Ayurvedic Formulary of India, Part I & II, Ministry of AYUSH
- CCRAS Publications
- PubMed/MEDLINE indexed literature

---

## 🚀 CI/CD

- **GitHub Actions** builds signed AAB + split APKs on every version tag (`v*`)
- Artifacts attached to GitHub Release with auto-generated notes
- Android minSdk 23 (Android 6.0+)

---

## 📄 License

MIT License — see [LICENSE](LICENSE)

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Add/modify data in `tools/data_generator/generate_data.py` with **proper citations**
4. Run `python tools/data_generator/generate_data.py` to regenerate JSON
5. Submit PR with citations for any new medical/Ayurvedic content

**Content standards:** All medical claims require authoritative citations (NLEM, WHO, API, PubMed PMID, etc.). Ayurvedic entries must include classical source, pharmacopoeia reference, and evidence grade.

---

## 📧 Contact

For content corrections or safety concerns: [Create an issue](https://github.com/USERNAME/MedPocket/issues) with citations.

---

**Built with Flutter • Made for India • Privacy by design**