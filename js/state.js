export const state = {
  svg: null,
  hasMoved: false,
  selectedStation: null,
  routeMode: false,
  originStation: null,
};

export function setSvg(value) { state.svg = value; }
export function setHasMoved(value) { state.hasMoved = value; }
export function setSelectedStation(value) { state.selectedStation = value; }
export function setRouteMode(value) { state.routeMode = value; }
export function setOriginStation(value) { state.originStation = value; }