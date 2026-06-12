import { SCHEDULE_RAW } from './config.js';

async function loadSchedule() {
    try {
        const r = await fetch('data/scraped_data.json');
        Object.assign(SCHEDULE_RAW, await r.json());
    } catch {
        const r = await fetch('data/scraped_data_backup.json');
        Object.assign(SCHEDULE_RAW, await r.json());
    }
}

export { loadSchedule };