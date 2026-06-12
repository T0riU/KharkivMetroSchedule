const LINES = {
  red: {
    key: 'kholodnohikrsko-zavodska-liniia/',
    name: 'Холодногірсько-Заводська',
    color: '#bf3f52',
    terminus: ['Холодна Гора', 'Індустріальна'],
    stations: [
      {id:'r1', name:'Холодна Гора',    skey:'stantsiia-%C2%ABkholodna-hokra%C2%BB.html'},
      {id:'r2', name:'Вокзальна',       skey:'stantsiia-%C2%ABvokzalna%C2%BB.html'},
      {id:'r3', name:'Центральний ринок',skey:'stantsiia-%C2%ABtsentkralnyi-krynok%C2%BB.html'},
      {id:'r4', name:'Майдан Конституції',skey:'stantsiia-%C2%ABmaidan-konstytutsii%C2%BB.html'},
      {id:'r5', name:'Левада',          skey:'stantsiia-%C2%ABlevada%C2%BB.html'},
      {id:'r6', name:'Спортивна',       skey:'stantsiia-%C2%ABspokrtyvna%C2%BB.html'},
      {id:'r7', name:'Заводська',       skey:'stantsiia-%C2%ABzavodska%C2%BB.html'},
      {id:'r8', name:'Турбоатом',       skey:'stantsiia-%C2%ABtukrboatom%C2%BB.html'},
      {id:'r9', name:'Палац Спорту',    skey:'stantsiia-%C2%ABpalats-spokrtu%C2%BB.html'},
      {id:'r10_',name:'Армійська',      skey:'stantsiia-%C2%ABakrmiiska%C2%BB.html'},
      {id:'r11_',name:'Ім. О.С. Масельського',skey:'stantsiia-%C2%ABim.-o.s.-maselskoho%C2%BB.html'},
      {id:'r12_',name:'Тракторний завод',skey:'stantsiia-%C2%ABtkraktokrnyi-zavod%C2%BB.html'},
      {id:'r13_',name:'Індустріальна',  skey:'stantsiia-%C2%ABindustkrialna%C2%BB.html'},
    ]
  },
  blue: {
    key: 'saltivska-liniia/',
    name: 'Салтівська',
    color: '#547dcd',
    terminus: ['Салтівська', 'Історичний музей'],
    stations: [
      {id:'b1', name:'Салтівська',       skey:'stantsiia-%C2%ABsaltivska%C2%BB.html'},
      {id:'b2', name:'Студентська',      skey:'stantsiia-%C2%ABstudentska%C2%BB.html'},
      {id:'b3', name:'Академіка Павлова',skey:'stantsiia-%C2%ABakademika-pavlova%C2%BB.html'},
      {id:'b4', name:'Академіка Барабашова',skey:'stantsiia-%C2%ABakademika-bakrabashova%C2%BB.html'},
      {id:'b5', name:'Київська',         skey:'stantsiia-%C2%ABkyivska%C2%BB.html'},
      {id:'b6', name:'Ярослава Мудрого', skey:'stantsiia-%C2%AByakroslava-mudkroho%C2%BB.html'},
      {id:'b7', name:'Університет',      skey:'stantsiia-%C2%ABunivekrsytet%C2%BB.html'},
      {id:'b8', name:'Історичний музей', skey:'stantsiia-%C2%ABistokrychnyi-muzei%C2%BB.html'},
    ]
  },
  green: {
    key: 'oleksiivska-liniia/',
    name: 'Олексіївська',
    color: '#1d9a2c',
    terminus: ['Перемога', 'Метробудівників'],
    stations: [
      {id:'g9', name:'Перемога',           skey:'stantsiia-%C2%ABpekremoha%C2%BB.html'},
      {id:'g8', name:'Олексіївська',       skey:'stantsiia-%C2%ABoleksiivska%C2%BB.html'},
      {id:'g7', name:'23 Серпня',          skey:'stantsiia-%C2%AB23-sekrpnia%C2%BB.html'},
      {id:'g6', name:'Ботанічний сад',     skey:'stantsiia-%C2%ABbotanichnyi-sad%C2%BB.html'},
      {id:'g5', name:'Наукова',            skey:'stantsiia-%C2%ABnaukova%C2%BB.html'},
      {id:'g4', name:'Держпром',           skey:'stantsiia-%C2%ABdekrzhpkrom%C2%BB.html'},
      {id:'g3', name:'Архітектора Бекетова',skey:'stantsiia-%C2%ABakrkhitektokra-beketova%C2%BB.html'},
      {id:'g2', name:'Захисників України', skey:'stantsiia-%C2%ABzakhysnykiv-ukkrainy%C2%BB.html'},
      {id:'g1', name:'Метробудівників',    skey:'stantsiia-%C2%ABmetkrobudivnykiv%C2%BB.html'},
    ]
  }
};


const STATION_MAP = {};
for (const [lk, line] of Object.entries(LINES)) {
  line.stations.forEach((s, idx) => {
    STATION_MAP[s.id] = { ...s, lineKey: lk, line, lineIdx: idx };
  });
}
 
// ─────────────────────────────────────────────
//  COOKIES — defined first so everything can use them
// ─────────────────────────────────────────────
function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}
function getCookie(name) {
  const m = document.cookie.match('(?:^|; )' + name + '=([^;]*)');
  return m ? decodeURIComponent(m[1]) : null;
}
 
// ─────────────────────────────────────────────
//  SCHEDULE DATA — populated by schedule-loader.js via Object.assign
// ─────────────────────────────────────────────
const SCHEDULE_RAW = {};
 
// ─────────────────────────────────────────────
//  SETTINGS
// ─────────────────────────────────────────────
const settings = {
  blueInterval: 120,
  greenInterval: 120,
  redInterval: 120,
  transferSec: 180,
  forceWeekday: false,
  forceWeekend: false,
};
// Load saved settings from cookie immediately
(function loadSettingsCookie() {
  const s = getCookie('metro_settings');
  if (!s) return;
  try {
    const p = JSON.parse(s);
    if (p.blueInterval)  settings.blueInterval  = p.blueInterval;
    if (p.greenInterval) settings.greenInterval = p.greenInterval;
    if (p.redInterval)   settings.redInterval   = p.redInterval;
    if (p.transferSec)   settings.transferSec   = p.transferSec;
  } catch {}
})();
 
export {
    SCHEDULE_RAW,
    LINES,
    STATION_MAP,
    settings,
    setCookie,
    getCookie
};
 