import { STATION_MAP } from './config.js';
import { openStation } from './panel.js';
import { state, setSvg, setHasMoved } from './state.js';
const mapWrap = document.getElementById('map-wrap');
async function loadMap() {
  const r = await fetch('img/map_comp.svg');
  const text = await r.text();
  mapWrap.innerHTML = text;
  setSvg(mapWrap.querySelector('svg'));
  state.svg.style.width = '700px';
  state.svg.style.height = '700px';

  // Tag station ellipses with data-station
  state.svg.querySelectorAll('ellipse[id^="map4-u-"]').forEach(el => {
    const stId = el.id.replace('map4-u-', '');
    if (STATION_MAP[stId]) el.setAttribute('data-station', stId);
  });

  // pointer-events: let the SVG root receive all events (click/touch handled by JS proximity search)
  // Just disable filter transitions that cause rendering flicker on hover
  state.svg.querySelectorAll('[data-station]').forEach(el => {
    el.style.pointerEvents = 'all';
  });
}

// ── Pan & Zoom ──
let scale = 1, tx = 0, ty = 0;
let panning = false, px = 0, py = 0;

function applyTransform() {
  state.svg.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
}

function centerMap() {
  const rect = mapWrap.getBoundingClientRect();
  const s = Math.min(rect.width / 700, rect.height / 700) * 0.9;
  scale = s;
  tx = (rect.width - 700 * s) / 2;
  ty = (rect.height - 700 * s) / 2;
  applyTransform();
}

mapWrap.addEventListener('wheel', e => {
  e.preventDefault();
  const rect = mapWrap.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const factor = e.deltaY < 0 ? 1.15 : 0.87;
  const ns = Math.min(Math.max(scale * factor, 0.3), 8);
  tx = mx - (mx - tx) * (ns / scale);
  ty = my - (my - ty) * (ns / scale);
  scale = ns;
  applyTransform();
}, { passive: false });

mapWrap.addEventListener('mousedown', e => {
  panning = true; setHasMoved(false);
  px = e.clientX - tx;
  py = e.clientY - ty;
  mapWrap.classList.add('panning');
});
mapWrap.addEventListener('mousemove', e => {
  if (!panning) return;
  const dx = e.clientX - px - tx;
  const dy = e.clientY - py - ty;
  if (Math.abs(dx) + Math.abs(dy) > 5) setHasMoved(true);
  tx = e.clientX - px;
  ty = e.clientY - py;
  applyTransform();
});
mapWrap.addEventListener('mouseup', () => { panning = false; mapWrap.classList.remove('panning'); });
mapWrap.addEventListener('mouseleave', () => { panning = false; mapWrap.classList.remove('panning'); });

// ── Touch pan/zoom ──
let touches = [];
let lastDist = 0;

mapWrap.addEventListener('touchstart', e => {
  e.preventDefault();
  touches = Array.from(e.touches);
  if (touches.length === 1) {
    panning = true; setHasMoved(false);
    px = touches[0].clientX - tx;
    py = touches[0].clientY - ty;
  } else if (touches.length === 2) {
    panning = false;
    lastDist = Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
  }
}, { passive: false });

mapWrap.addEventListener('touchmove', e => {
  e.preventDefault();
  const ts = Array.from(e.touches);
  if (ts.length === 1 && panning) {
    const dx = ts[0].clientX - px - tx;
    const dy = ts[0].clientY - py - ty;
    if (Math.abs(dx) + Math.abs(dy) > 8) setHasMoved(true);
    tx = ts[0].clientX - px;
    ty = ts[0].clientY - py;
    applyTransform();
  } else if (ts.length === 2) {
    const dist = Math.hypot(ts[0].clientX - ts[1].clientX, ts[0].clientY - ts[1].clientY);
    const mx = (ts[0].clientX + ts[1].clientX) / 2 - mapWrap.getBoundingClientRect().left;
    const my = (ts[0].clientY + ts[1].clientY) / 2 - mapWrap.getBoundingClientRect().top;
    const factor = dist / lastDist;
    const ns = Math.min(Math.max(scale * factor, 0.3), 8);
    tx = mx - (mx - tx) * (ns / scale);
    ty = my - (my - ty) * (ns / scale);
    scale = ns;
    lastDist = dist;
    applyTransform();
  }
}, { passive: false });

mapWrap.addEventListener('touchend', e => {
  if (e.touches.length === 0) panning = false;
  const wasMoved = state.hasMoved;
  setHasMoved(false);
  if (!wasMoved && e.changedTouches.length === 1) {
    const touch = e.changedTouches[0];
    handleMapTap(touch.clientX, touch.clientY);
  }
});

// Shared tap-handling logic for both touch and (via app.js) click events:
// try a direct DOM hit on a [data-station] element first, then fall back
// to proximity search against station markers.
function handleMapTap(clientX, clientY) {
  const directEl = document.elementFromPoint(clientX, clientY);
  const directHit = directEl && directEl.closest('[data-station]');
  if (directHit) {
    openStation(directHit.getAttribute('data-station'));
    return;
  }
  findAndOpenNearestStation(clientX, clientY);
}

function findAndOpenNearestStation(clientX, clientY) {
  const hitRadiusSVG = 44 / scale;
  const pt = state.svg.createSVGPoint();
  pt.x = clientX; pt.y = clientY;
  const svgP = pt.matrixTransform(state.svg.getScreenCTM().inverse());
  let best = null, bestDist = hitRadiusSVG;
  state.svg.querySelectorAll('[data-station]').forEach(el => {
    let cx, cy;
    if (el.tagName === 'ellipse' || el.tagName === 'circle') {
      cx = parseFloat(el.getAttribute('cx'));
      cy = parseFloat(el.getAttribute('cy'));
    } else {
      try { const bb = el.getBBox(); cx = bb.x + bb.width/2; cy = bb.y + bb.height/2; } catch { return; }
    }
    const dist = Math.hypot(svgP.x - cx, svgP.y - cy);
    if (dist < bestDist) { bestDist = dist; best = el; }
  });
  if (best) openStation(best.getAttribute('data-station'));
}
export {
    loadMap,
    centerMap,
    findAndOpenNearestStation,
    handleMapTap,
    mapWrap
};