import {
    loadMap,
    centerMap,
    handleMapTap
} from './map.js';

import {
    loadSchedule
} from './schedule-loader.js';

import {
    isPanelOpen,
    updateTimes,
    openStation
} from './panel.js';

import {
    state,
    setHasMoved
} from './state.js';
import {
    STATION_MAP,
    getCookie,
    settings,
    setCookie
} from './config.js';

import {
    kyivNow,
    getDayType
} from './schedule.js';


const clockEl = document.getElementById('clock');
const dayBadge = document.getElementById('day-badge');

function tick() {
  const t = kyivNow();
  const h = String(t.hours).padStart(2,'0');
  const m = String(t.minutes).padStart(2,'0');
  const s = String(t.seconds).padStart(2,'0');
  clockEl.textContent = `${h}:${m}:${s}`;
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayBadge.textContent = dayNames[t.day];

  const isWeekend = getDayType() === 1; 
  const clockWrap = document.getElementById('clock-wrap');
  clockWrap.classList.toggle('weekend', isWeekend);
  clockWrap.classList.toggle('weekday', !isWeekend);
  if (state.selectedStation && isPanelOpen() && !state.routeMode) {
    const st = STATION_MAP[state.selectedStation];
    if (st) updateTimes(st);
  }
}
// ─────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────
Promise.all([loadSchedule(), loadMap()]).then(() => {
  if (!state.svg) return;
  state.svg.addEventListener('click', e => {
    if (state.hasMoved) { setHasMoved(false); return; }
    const target = e.target.closest('[data-station]');
    if (target) { openStation(target.getAttribute('data-station')); return; }
    handleMapTap(e.clientX, e.clientY);
  });

  window.addEventListener('resize', centerMap);
  centerMap();
  setInterval(tick, 1000);
  tick();

  // Restore last station from cookie — just open it as if user tapped it
  const lastSt = getCookie('metro_last_station');
  if (lastSt && STATION_MAP[lastSt]) openStation(lastSt);
}).catch(err => {
  console.error('Initialization failed:', err);
});

// ─────────────────────────────────────────────
//  SETTINGS UI
// ─────────────────────────────────────────────
document.getElementById('settings-btn').addEventListener('click', () => {
  document.getElementById('s-blue').value = settings.blueInterval;
  document.getElementById('s-green').value = settings.greenInterval;
  document.getElementById('s-red').value = settings.redInterval;
  document.getElementById('s-transfer').value = settings.transferSec;
  document.getElementById('settings-overlay').classList.add('open');
});
document.getElementById('settings-close').addEventListener('click', () => {
  settings.blueInterval  = parseInt(document.getElementById('s-blue').value) || 120;
  settings.greenInterval = parseInt(document.getElementById('s-green').value) || 120;
  settings.redInterval   = parseInt(document.getElementById('s-red').value) || 120;
  settings.transferSec   = parseInt(document.getElementById('s-transfer').value) || 180;
  // Save settings to cookie
  setCookie('metro_settings', JSON.stringify({
    blueInterval:  settings.blueInterval,
    greenInterval: settings.greenInterval,
    redInterval:   settings.redInterval,
    transferSec:   settings.transferSec,
  }));
  document.getElementById('settings-overlay').classList.remove('open');
});
document.getElementById('settings-overlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) e.currentTarget.classList.remove('open');
});