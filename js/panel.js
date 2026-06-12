import {
    STATION_MAP,
    setCookie,
    settings
} from './config.js';

import {
    getSchedule,
    getNextTrains,
    kyivNowMin
} from './schedule.js';
import {
    calcRoute,
    getIntervalForLine
} from './route.js';
import {
    state, setSelectedStation,setRouteMode,setOriginStation
} from './state.js';


const panel = document.getElementById('bottom-panel');
const panelName = document.getElementById('panel-name');
const panelDot = document.getElementById('panel-dot');
const panelLine = document.getElementById('panel-line');
const timesGrid = document.getElementById('times-grid');
const routeBtn = document.getElementById('route-btn');
const routeResult = document.getElementById('route-result');
const closeBtn = document.getElementById('panel-close-btn');
const dragArea = panel.querySelector('.panel-drag-area');

const ROUTE_BTN_DEFAULT_TEXT = 'Маршрут до іншої станції';
const ROUTE_BTN_ACTIVE_TEXT  = 'Виберіть станцію призначення…';

function resetRouteBtn() {
  routeBtn.textContent = ROUTE_BTN_DEFAULT_TEXT;
  routeBtn.classList.remove('active');;
}
function clearRoute() {
  setRouteMode(false);
  setOriginStation(null);
  resetRouteBtn();
  routeResult.classList.remove('show');
  routeResult.innerHTML = '';
}
function showRouteNotFound() {
  routeResult.innerHTML = '<div class="route-no">Маршрут не знайдено</div>';
  routeResult.classList.add('show');
}

function openStation(stId) {
  if (state.hasMoved) return;
  const station = STATION_MAP[stId];
  if (!station) return;
  if (!state.svg) return;
  // Deselect previous
  if (state.selectedStation) {
    const el = state.svg.querySelector(`ellipse[data-station="${state.selectedStation}"]`);
    if (el) el.classList.remove('selected');
  }

  if (state.routeMode && state.originStation) {
    const route = calcRoute(state.originStation, stId);

    if (route) {
        showRouteResult(route);
    } else {
        showRouteNotFound();
    }

    return;
  }

  setSelectedStation(stId);
  const el = state.svg.querySelector(`ellipse[data-station="${stId}"]`);
  if (el) el.classList.add('selected');
  showPanel(station);
  setCookie('metro_last_station', stId);
}

// Close: remove selection, reset state, hide panel
function closePanel() {
  panel.classList.remove('open');
  if (state.selectedStation) {
    const el = state.svg.querySelector(`ellipse[data-station="${state.selectedStation}"]`);
    if (el) el.classList.remove('selected');
  }
  setSelectedStation(null);
  clearRoute();
  setCookie('metro_last_station', '');
}

// Collapse: just hide panel visually — station stays selected
// Tapping the highlighted dot on the map reopens the panel
function collapsePanel() {
  panel.classList.remove('open');
  panel.classList.add('collapsed');
}

function expandPanel() {
  panel.classList.remove('collapsed');
  panel.classList.add('open');
}
 
closeBtn.addEventListener('click', closePanel);
let dragStartY = 0;
let dragStartTime = 0;
let dragging = false;
 
function getOpenHeight() {
  return panel.getBoundingClientRect().height;
}
 
function getCollapsedHeight() {
  return parseFloat(getComputedStyle(panel).getPropertyValue('--panel-collapsed-h')) || 20;
}
 
function setDragOffset(px) {
  panel.style.setProperty('--panel-drag', `${px}px`);
}
 
function onDragStart(clientY) {
  if (!panel.classList.contains('open') && !panel.classList.contains('collapsed')) return;
  dragging = true;
  dragStartY = clientY;
  dragStartTime = Date.now();
  panel.classList.add('dragging');
}
function onDragMove(clientY) {
  if (!dragging) return;
  const dy = clientY - dragStartY;
  const openH = getOpenHeight();
  const collapsedH = getCollapsedHeight();
  const maxOffset = openH - collapsedH;
  const base = panel.classList.contains('collapsed') ? maxOffset : 0;
 
  const absolute = Math.min(Math.max(base + dy, 0), maxOffset);
  setDragOffset(absolute - base);
}
 
function onDragEnd(clientY) {
  if (!dragging) return;
  dragging = false;
  panel.classList.remove('dragging');
 
  const dy = clientY - dragStartY;
  const dt = Date.now() - dragStartTime;
  const openH = getOpenHeight();
  const collapsedH = getCollapsedHeight();
  const threshold = (openH - collapsedH) * 0.3;
  const wasCollapsed = panel.classList.contains('collapsed');
  const fastFlick = dt < 300 && Math.abs(dy) > 30;
 
  setDragOffset(0);
 
  if (!wasCollapsed) {
    // Was open: collapse if dragged down past threshold, or fast downward flick
    if (dy > threshold || (fastFlick && dy > 0)) {
      collapsePanel();
    }
    // else snaps back to open via the transition
  } else {
    // Was collapsed: expand if dragged up past threshold, or fast upward flick
    if (-dy > threshold || (fastFlick && dy < 0)) {
      expandPanel();
    }
    // else snaps back to collapsed via the transition
  }
}
dragArea.addEventListener('mousedown', e => onDragStart(e.clientY));
window.addEventListener('mousemove', e => onDragMove(e.clientY));
window.addEventListener('mouseup', e => onDragEnd(e.clientY));
 
dragArea.addEventListener('touchstart', e => onDragStart(e.touches[0].clientY), { passive: true });
dragArea.addEventListener('touchmove', e => {
  onDragMove(e.touches[0].clientY);
}, { passive: true });
dragArea.addEventListener('touchend', e => onDragEnd(e.changedTouches[0].clientY), { passive: true });
 
// Tapping the collapsed handle also reopens the panel
dragArea.addEventListener('click', () => {
  if (panel.classList.contains('collapsed')) expandPanel();
});
 
function showPanel(station) {
  panel.classList.remove('collapsed');
  panel.classList.add('open');
  panelName.textContent = station.name;
  panelDot.style.background = station.line.color;
  panelLine.textContent = station.line.name;
  clearRoute();
  updateTimes(station);
}
 
function updateTimes(station) {
  const nowMin = kyivNowMin();
  const idx = station.lineIdx;
  const totalStations = station.line.stations.length;
  const dir1 = station.line.terminus[0];
  const dir2 = station.line.terminus[1];
 
  const timesDir0 = getSchedule(station.line.key, station.skey, 0);
  const timesDir1 = getSchedule(station.line.key, station.skey, 1);
  const nextDir0 = getNextTrains(timesDir0, nowMin, 3);
  const nextDir1 = getNextTrains(timesDir1, nowMin, 3);
 
  function formatMins(diffMin) {
    if (diffMin < 1) return '<span class="next-train">зараз</span>';
    if (diffMin < 60) return `<span class="next-train">${diffMin}<span class="unit"> хв</span></span>`;
    return `<span class="next-train">${Math.floor(diffMin/60)}г ${diffMin%60}<span class="unit"> хв</span></span>`;
  }
 
  function makeCard(terminus, trains) {
    let html = `<div class="direction-card" style="border-left-color:${station.line.color}">
      <div class="dir-terminal">→ ${terminus}</div>`;
    if (trains.length === 0) {
      html += `<div class="no-trains">Поїздів немає</div>`;
    } else {
      html += formatMins(trains[0].diff);
      html += `<div class="next-train-time">${trains.map(t => t.t).join(' · ')}</div>`;
    }
    html += `</div>`;
    return html;
  }
 
  timesGrid.innerHTML =
    (idx > 0 ? makeCard(dir1, nextDir1) : '') +
    (idx < totalStations - 1 ? makeCard(dir2, nextDir0) : '');
}
 
// Toggle: first click starts route selection, second click (while active)
// cancels it. Selecting a destination station also exits route mode
// (handled in openStation -> showRouteResult).
routeBtn.addEventListener('click', () => {
  if (!state.selectedStation) return;
 
  if (state.routeMode) {
    clearRoute();
    return;
  }
 
  setOriginStation(state.selectedStation);
  setRouteMode(true);
  routeBtn.textContent = ROUTE_BTN_ACTIVE_TEXT;
  routeBtn.classList.add('active');
  routeResult.classList.remove('show');
});
 
function fmtTime(totalMin) {
  const h = Math.floor(totalMin / 60) % 24;
  const m = totalMin % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}
 
function showRouteResult({ from, to, stops, totalMin, transfer, stops1, stops2, nowMin }) {
  const stopsLabel = n => n === 1 ? 'зупинка' : n < 5 ? 'зупинки' : 'зупинок';
 
  // Direction index for the departure schedule of the "from" station:
  // 0 = towards higher lineIdx, 1 = towards lower lineIdx
  const targetIdx = transfer ? transfer.fromStation.lineIdx : to.lineIdx;
  const dirIdx = from.lineIdx < targetIdx ? 0 : 1;
 
  const times = getSchedule(from.line.key, from.skey, dirIdx);
  const next = getNextTrains(times, nowMin, 3);
 
  let html = `<div class="route-summary">`;
  html += `<div class="route-time-big">${totalMin} хв</div>`;
  html += `<div class="route-stops">${stops} ${stopsLabel(stops)}</div>`;
  html += `</div>`;
 
  html += `<div class="route-steps">`;
 
  if (!transfer) {
    html += `<div class="route-step">`;
    html += `<div class="route-step-line" style="background:${from.line.color}"></div>`;
    html += `<div class="route-step-body">`;
    html += `<div class="route-step-from">${from.name}</div>`;
    html += `<div class="route-step-meta">${from.line.name} · ${stops} ${stopsLabel(stops)} · ~${totalMin} хв</div>`;
    html += `<div class="route-step-to">→ ${to.name}</div>`;
    html += `</div></div>`;
  } else {
    const transferSec = settings.transferSec;
    const leg1Min = Math.ceil(stops1 * getIntervalForLine(from.lineKey) / 60);
    const leg2Min = Math.ceil(stops2 * getIntervalForLine(to.lineKey) / 60);
    const transferMin = Math.ceil(transferSec / 60);
 
    html += `<div class="route-step">`;
    html += `<div class="route-step-line" style="background:${from.line.color}"></div>`;
    html += `<div class="route-step-body">`;
    html += `<div class="route-step-from">${from.name}</div>`;
    html += `<div class="route-step-meta">${from.line.name} · ${stops1} ${stopsLabel(stops1)} · ~${leg1Min} хв</div>`;
    html += `<div class="route-step-to">→ ${transfer.name}</div>`;
    html += `</div></div>`;
 
    html += `<div class="route-transfer-badge">🚶 Пересадка ~${transferMin} хв → ${transfer.toName}</div>`;
 
    html += `<div class="route-step">`;
    html += `<div class="route-step-line" style="background:${to.line.color}"></div>`;
    html += `<div class="route-step-body">`;
    html += `<div class="route-step-from">${transfer.toName}</div>`;
    html += `<div class="route-step-meta">${to.line.name} · ${stops2} ${stopsLabel(stops2)} · ~${leg2Min} хв</div>`;
    html += `<div class="route-step-to">→ ${to.name}</div>`;
    html += `</div></div>`;
  }
  html += `</div>`;
 
  if (next.length > 0) {
    html += `<div class="route-trains">`;
    html += `<div class="route-trains-label">Найближчі відправлення з ${from.name}:</div>`;
    html += `<div class="route-train-list">`;
    next.forEach(n => {
      const arriveMin = nowMin + n.diff + totalMin;
      html += `<div class="route-train-row">`;
      html += `<span class="route-train-dep">🚇 ${n.t}</span>`;
      html += `<span class="route-train-arr">прибуття ~${fmtTime(arriveMin)}</span>`;
      html += `</div>`;
    });
    html += `</div></div>`;
}
 
  routeResult.innerHTML = html;
  routeResult.classList.add('show');

}
 
export function isPanelOpen() {
    return panel.classList.contains('open');
}
export {
    openStation,
    updateTimes
};