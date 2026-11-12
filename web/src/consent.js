import { useSyncExternalStore } from 'react';

// Consentimento de cookies (LGPD). Categorias:
// - necessários: sempre ativos (o próprio cookie de consentimento e a sessão do painel)
// - preferências: favoritos do visitante
// - estatísticas: contagem anônima de visualizações dos animais
const CONSENT_COOKIE = 'ra_consent';
const SIX_MONTHS = 60 * 60 * 24 * 180;
export const FAVORITES_COOKIE = 'ra_favoritos';

export function readCookie(name) {
  const entry = document.cookie.split('; ').find((c) => c.startsWith(name + '='));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : null;
}

export function writeCookie(name, value, maxAge = SIX_MONTHS) {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

export function deleteCookie(name) {
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

// Formato do cookie: "v1|p1|s0|2026-11-12T13:00:00.000Z" (versão, preferências, estatísticas, data)
function parse(raw) {
  const [version, p, s, date] = (raw ?? '').split('|');
  if (version !== 'v1') return null;
  return { preferences: p === 'p1', statistics: s === 's1', date };
}

let cached = parse(readCookie(CONSENT_COOKIE));
const listeners = new Set();

export function getConsent() {
  return cached;
}

export function saveConsent({ preferences, statistics }) {
  const date = new Date().toISOString();
  writeCookie(CONSENT_COOKIE, `v1|${preferences ? 'p1' : 'p0'}|${statistics ? 's1' : 's0'}|${date}`);
  if (!preferences) deleteCookie(FAVORITES_COOKIE);
  cached = { preferences, statistics, date };
  listeners.forEach((fn) => fn());
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useConsent() {
  return useSyncExternalStore(subscribe, getConsent);
}

// Permite que qualquer parte do site reabra o painel de preferências de cookies.
export function openCookieSettings(reason) {
  window.dispatchEvent(new CustomEvent('ra:cookie-settings', { detail: { reason } }));
}
