import { delay } from 'utils/index.js';
class SongService {
    cache = {};
    async list({ category = 'new', limit = 1000, offset = 0 }) {
        const cacheRespones = this.cache[category] || (await this.getData(category));
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
                    this.cache[category] = resp;
                    resolve(resp);
                })
                .catch(reject);
        });
    }
}
export default new SongService();
