import { STATION_MAP, settings } from './config.js';
import { kyivNowMin } from './schedule.js';

function getIntervalForLine(lk) {
  if (lk === 'blue') return settings.blueInterval;
  if (lk === 'green') return settings.greenInterval;
  return settings.redInterval;
}

const TRANSFERS = {
  'b7': 'g4', 'g4': 'b7',
  'b8': 'r3', 'r3': 'b8',
  'g3': 'r6', 'r6': 'g3',
};

function calcRoute(fromId, toId) {
  const from = STATION_MAP[fromId];
  const to   = STATION_MAP[toId];
  if (!from || !to) return null;

  const nowMin = kyivNowMin();

  if (from.lineKey === to.lineKey) {
    const stops = Math.abs(from.lineIdx - to.lineIdx);
    const totalSec = stops * getIntervalForLine(from.lineKey);
    const totalMin = Math.ceil(totalSec / 60);
    return { from, to, stops, totalMin, transfer: null, nowMin };
  }

  let bestTime = Infinity;
  let bestPath = null;

  for (const [tA, tB] of Object.entries(TRANSFERS)) {
    const tAStation = STATION_MAP[tA];
    const tBStation = STATION_MAP[tB];
    if (!tAStation || !tBStation) continue;
    if (tAStation.lineKey !== from.lineKey) continue;
    if (tBStation.lineKey !== to.lineKey) continue;

    const stops1 = Math.abs(from.lineIdx - tAStation.lineIdx);
    const stops2 = Math.abs(tBStation.lineIdx - to.lineIdx);
    const sec = stops1 * getIntervalForLine(from.lineKey)
              + settings.transferSec
              + stops2 * getIntervalForLine(to.lineKey);

    if (sec < bestTime) {
      bestTime = sec;
      bestPath = { stops1, stops2, tAStation, tBStation };
    }
  }

  if (!bestPath) return null;

  const totalMin = Math.ceil(bestTime / 60);

  return {
    from,
    to,
    stops: bestPath.stops1 + bestPath.stops2,
    totalMin,
    transfer: {
      name: bestPath.tAStation.name,
      toName: bestPath.tBStation.name,
      fromStation: bestPath.tAStation,
      toStation: bestPath.tBStation
    },
    stops1: bestPath.stops1,
    stops2: bestPath.stops2,
    nowMin
  };
}

export {
    calcRoute,
    getIntervalForLine,
    TRANSFERS
};