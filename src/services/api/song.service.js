import { delay, safaJsonParse } from 'utils/index.js'; // eslint-disable-line
const CACHE_PREFIX = 'SONGS_'; // eslint-disable-line
class SongService {
    async list({ category = 'new', id }) {
        const cachedData = safaJsonParse(window.sessionStorage.getItem(`${CACHE_PREFIX}_${category}_${id}`));
        if (cachedData) {
            return Promise.resolve({
                data: cachedData.data,
                total: cachedData.meta.trackCount,
                title: cachedData.meta.name
            });
        }
        const cacheRespones = await this.getData(category, id);
        // const start = limit * offset;
        // const end = limit * (offset + 1);
        const res = {
            data: cacheRespones.data,
            total: cacheRespones.meta.trackCount,
            title: cacheRespones.meta.name
        };
        // await delay(800);
        return Promise.resolve(res);
    }
    getData(category, id) {
        return new Promise((resolve, reject) => {
            fetch(`/songs/${category}`, {
                params: { id }
            })
                .then(resp => {
                    window.sessionStorage.setItem(`${CACHE_PREFIX}_${category}_${id}`, JSON.stringify(resp));
                    resolve(resp);
                })
                .catch(reject);
        });
    }
}
export default new SongService();
