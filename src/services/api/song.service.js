import { delay, safaJsonParse } from 'utils/index.js';
const CACHE_PREFIX = 'SONGS_';
class SongService {
    cache = {};
    async list({ category = 'new', limit = 1000, offset = 0 }) {
        const cachedData = safaJsonParse(window.sessionStorage.getItem(`${CACHE_PREFIX}_${category}`));
        if (cachedData) {
            return Promise.resolve({
                data: cachedData.data,
                total: cachedData.data.length
            });
        }
        const cacheRespones = await this.getData(category);
        const start = limit * offset;
        const end = limit * (offset + 1);
        const res = {
            data: cacheRespones.data.slice(start, end),
            total: cacheRespones.data.length
        };
        await delay(800);
        return Promise.resolve(res);
    }
    getData(category) {
        return new Promise((resolve, reject) => {
            fetch(`/songs/${category}`)
                .then(resp => {
                    window.sessionStorage.setItem(`${CACHE_PREFIX}_${category}`, JSON.stringify(resp));
                    resolve(resp);
                })
                .catch(reject);
        });
    }
}
export default new SongService();
