import { Product, MediaImage } from '../types';

export interface SyncPayload {
  products?: Product[];
  mediaLibrary?: MediaImage[];
  heroImage?: string | null;
  customPhone?: string;
}

export interface SyncResponse {
  success: boolean;
  data?: {
    products?: Product[] | null;
    mediaLibrary?: MediaImage[] | null;
    heroImage?: string | null;
    customPhone?: string | null;
    lastUpdated?: number;
  };
  message?: string;
  error?: string;
}

/**
 * Fetch synchronized catalog data from server
 */
export async function fetchServerSyncData(): Promise<SyncResponse['data'] | null> {
  try {
    const res = await fetch('/api/sync/data', {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return null;
    const json: SyncResponse = await res.json();
    return json.data || null;
  } catch (err) {
    // Silent fail in offline or static mode
    console.debug('API Sync fetch unavailable (running static):', err);
    return null;
  }
}

/**
 * Push updated catalog and photos to server for multi-device sync
 */
export async function pushServerSyncData(payload: SyncPayload): Promise<boolean> {
  try {
    const res = await fetch('/api/sync/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return false;
    const json: SyncResponse = await res.json();
    return !!json.success;
  } catch (err) {
    console.debug('API Sync push unavailable:', err);
    return false;
  }
}
