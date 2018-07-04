import { getObjectProperty, safaJsonParse } from 'utils/index';

// setItem('mykey', {a: 1}, 'a', 5)
// key('mykey', 'a')

export const sessionCache = {
    setItem: function(key, data, property, expiry) {
        if (expiry && +expiry > 0) {
            // prettier-ignore
            data.expiryAt = Date.now() + (expiry * 60000);
        }
        if (property) {
            const cached = this.getItem(key) || {};
            cached[property] = data;
            sessionStorage.setItem(key, JSON.stringify(cached));
            return;
        }
        sessionStorage.setItem(key, JSON.stringify(data));
    },
    getItem: function(key, property) {
        const cached = safaJsonParse(sessionStorage.getItem(key));
        const data = property ? getObjectProperty(cached, property) : cached;
        if (data && data.expiryAt) {
            if (data.expiryAt > Date.now()) return data;
            if (property) {
                delete cached[property];
                this.setItem(key, cached);
                return null;
            }
            sessionStorage.removeItem(key);
        }
        return data;
    }
};
