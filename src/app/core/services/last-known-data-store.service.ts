import { Injectable } from '@angular/core';

export interface LastKnownDataStore {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
}

@Injectable({ providedIn: 'root' })
export class LastKnownDataStoreService implements LastKnownDataStore {
  private memoryCache = new Map<string, { data: unknown; timestamp: number }>();
  private readonly DEFAULT_TTL_MS = 86_400_000;

  get<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);
    if (!entry) {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          this.memoryCache.set(key, { data: parsed, timestamp: Date.now() });
          return parsed as T;
        } catch {
          return null;
        }
      }
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, value: T): void {
    if (!this.isValidData(value)) return;
    this.memoryCache.set(key, { data: value, timestamp: Date.now() });
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* localStorage full or unavailable */
    }
  }

  remove(key: string): void {
    this.memoryCache.delete(key);
    localStorage.removeItem(key);
  }

  getTimestamp(key: string): number | null {
    const entry = this.memoryCache.get(key);
    if (entry) return entry.timestamp;
    return null;
  }

  isExpired(key: string, ttlMs: number): boolean {
    const ts = this.getTimestamp(key);
    if (ts === null) return true;
    return Date.now() - ts > ttlMs;
  }

  private isValidData<T>(value: T): boolean {
    if (value === null || value === undefined) return false;
    if (Array.isArray(value) && value.length === 0) return false;
    if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value as object).length === 0) return false;
    return true;
  }
}
