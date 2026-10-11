import { UserCabinetItem } from '../types/medication';

const CABINET_STORAGE_KEY = 'medpocket_cabinet_v1';
const SETTINGS_STORAGE_KEY = 'medpocket_settings_v1';

export interface PrivacySettings {
  airGapMode: boolean; // When true, disables all external network requests completely
  autoCheckInteractions: boolean;
  allowCameraScan: boolean;
  offlineFirstMode: boolean;
}

const DEFAULT_SETTINGS: PrivacySettings = {
  airGapMode: false,
  autoCheckInteractions: true,
  allowCameraScan: true,
  offlineFirstMode: true,
};

// Default seed cabinet for instant testing
const DEFAULT_CABINET: UserCabinetItem[] = [
  {
    id: 'seed-1',
    medicationId: 'metformin',
    drugName: 'Metformin 500mg',
    dosage: '500 mg',
    frequency: 'Twice daily',
    timing: 'With breakfast and dinner',
    notes: 'Prescribed for glucose management',
    dateAdded: '2026-10-01',
    takenToday: true,
  },
  {
    id: 'seed-2',
    medicationId: 'lisinopril',
    drugName: 'Lisinopril 10mg',
    dosage: '10 mg',
    frequency: 'Once daily',
    timing: 'Morning',
    notes: 'Blood pressure control',
    dateAdded: '2026-10-05',
    takenToday: false,
  },
];

export function getLocalCabinet(): UserCabinetItem[] {
  if (typeof window === 'undefined') return DEFAULT_CABINET;
  try {
    const raw = localStorage.getItem(CABINET_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CABINET_STORAGE_KEY, JSON.stringify(DEFAULT_CABINET));
      return DEFAULT_CABINET;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read local cabinet:', e);
    return DEFAULT_CABINET;
  }
}

export function saveLocalCabinet(items: UserCabinetItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CABINET_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save cabinet to local storage:', e);
  }
}

export function addToCabinet(item: Omit<UserCabinetItem, 'id' | 'dateAdded'>): UserCabinetItem {
  const current = getLocalCabinet();
  const newItem: UserCabinetItem = {
    ...item,
    id: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    dateAdded: new Date().toISOString().split('T')[0],
    takenToday: false,
  };
  const updated = [newItem, ...current];
  saveLocalCabinet(updated);
  return newItem;
}

export function removeFromCabinet(id: string): void {
  const current = getLocalCabinet();
  const filtered = current.filter(item => item.id !== id);
  saveLocalCabinet(filtered);
}

export function toggleTakenToday(id: string): void {
  const current = getLocalCabinet();
  const updated = current.map(item =>
    item.id === id ? { ...item, takenToday: !item.takenToday } : item
  );
  saveLocalCabinet(updated);
}

export function getPrivacySettings(): PrivacySettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function savePrivacySettings(settings: PrivacySettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function getStorageStats(): { bytesUsed: number; itemCount: number } {
  if (typeof window === 'undefined') return { bytesUsed: 0, itemCount: 0 };
  try {
    const cab = localStorage.getItem(CABINET_STORAGE_KEY) || '';
    const set = localStorage.getItem(SETTINGS_STORAGE_KEY) || '';
    const totalBytes = new Blob([cab, set]).size;
    const items = getLocalCabinet();
    return {
      bytesUsed: totalBytes,
      itemCount: items.length,
    };
  } catch {
    return { bytesUsed: 0, itemCount: 0 };
  }
}

export function purgeAllLocalData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CABINET_STORAGE_KEY);
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to purge local data:', e);
  }
}

export function exportCabinetAsJSON(): string {
  const data = {
    appName: 'MedPocket',
    version: '1.0.0',
    exportTimestamp: new Date().toISOString(),
    cabinet: getLocalCabinet(),
    privacyNotice: 'Zero-cloud verified. Stored on-device.',
  };
  return JSON.stringify(data, null, 2);
}
