import { settings, SCHEDULE_RAW } from './config.js';

function kyivNow() {
  const now = new Date();
  // Use Intl.DateTimeFormat parts — most reliable cross-browser approach
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Kyiv',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
    weekday: 'short',
  });
  const parts = {};
  fmt.formatToParts(now).forEach(p => { parts[p.type] = p.value; });
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return {
    hours:   parseInt(parts.hour,   10),
    minutes: parseInt(parts.minute, 10),
    seconds: parseInt(parts.second, 10),
    day: dayNames.indexOf(parts.weekday),
  };
}

function kyivNowMin() {
  const t = kyivNow();
  return t.hours * 60 + t.minutes;
}

function getDayType() {
  if (settings.forceWeekday) return 0;
  if (settings.forceWeekend) return 1;
  const d = kyivNow().day;
  return (d === 0 || d === 6) ? 1 : 0;
}
const WE_LINE_KEYS = {
  'kholodnohikrsko-zavodska-liniia/': '/kholodnohikrsko-zavodska-liniia-vykhidni-dni/',
  'saltivska-liniia/':                '/saltivska-liniia.html',
  'oleksiivska-liniia/':              '/oleksiivska-liniia-vykhidni-dni/',
};

function getSchedule(lineKey, stationKey, dirIndex = 0) {
  const isWeekend = getDayType() === 1;
  const dayKey = isWeekend
    ? '/hkrafiky-krukhu-poizdiv-u-vykhidni-dni/'
    : '/hkrafiky-krukhu-poizdiv-u-budni-dni/';
  const raw = SCHEDULE_RAW[dayKey];
  if (!raw) return [];
  const lk = isWeekend ? WE_LINE_KEYS[lineKey] : '/' + lineKey;
  const lineData = raw[lk];
  if (!lineData) return [];
  const skBase = stationKey.replace('.html', '');
  if (!isWeekend) {
    const arr = lineData['/' + stationKey];
    if (!arr) return [];
    return arr[dirIndex] || arr[0] || [];
  } else {
    const arr = lineData['/' + skBase + '-(vykhidni-dni).html']
             || lineData['/' + skBase + '-vykhidni-dni.html'];
    if (!arr) return [];
    return arr[dirIndex] || arr[0] || [];
  }
}

function timeToMin(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function getNextTrains(times, nowMin, count = 2) {
  return times
    .map(t => ({ t, diff: timeToMin(t) - nowMin }))
    .filter(x => x.diff >= 0)
    .sort((a, b) => a.diff - b.diff)
    .slice(0, count);
}
export {
    kyivNow,
    kyivNowMin,
    getDayType,
    getSchedule,
    timeToMin,
    getNextTrains
};