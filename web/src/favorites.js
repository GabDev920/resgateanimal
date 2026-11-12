import { useSyncExternalStore } from 'react';
import { FAVORITES_COOKIE, getConsent, readCookie, writeCookie, openCookieSettings } from './consent.js';

// Favoritos ficam num cookie de preferências: só existem se o visitante consentiu.
const EMPTY = [];
let cached = load();
const listeners = new Set();

function load() {
  if (!getConsent()?.preferences) return EMPTY;
  const ids = (readCookie(FAVORITES_COOKIE) ?? '').split(',').map(Number).filter(Boolean);
  return ids.length ? ids : EMPTY;
}

function notify() {
  cached = load();
  listeners.forEach((fn) => fn());
}

export function toggleFavorite(id) {
  if (!getConsent()?.preferences) {
    openCookieSettings('Para guardar favoritos, permita os cookies de preferências.');
    return;
  }
  const ids = new Set(load());
  if (ids.has(id)) ids.delete(id);
  else ids.add(id);
  writeCookie(FAVORITES_COOKIE, [...ids].slice(-50).join(','));
  notify();
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useFavorites() {
  return useSyncExternalStore(subscribe, () => cached);
}

// Quando o consentimento muda (ex.: preferências recusadas), os favoritos são recarregados.
export function refreshFavorites() {
  notify();
}
