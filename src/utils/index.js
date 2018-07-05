export function createReducer(initialState, handlers) {
    return (state = initialState, action) =>
        handlers.hasOwnProperty(action.type) ? handlers[action.type](state, action) : state;
}

/**
 * 字符串加密
 * @param {string} str
 */
export function encrypt(str) {
    let c = String.fromCharCode(str.charCodeAt(0) + str.length);
    for (let i = 1; i < str.length; i++) {
        c += String.fromCharCode(str.charCodeAt(i) + str.charCodeAt(i - 1));
    }
    return c;
}
/**
 * 字符串解密
 * @param {string} str
 */
export function decrypt(str) {
    let c = String.fromCharCode(str.charCodeAt(0) - str.length);
    for (let i = 1; i < str.length; i++) {
        c += String.fromCharCode(str.charCodeAt(i) - c.charCodeAt(i - 1));
    }
    return c;
}

export const delay = ms =>
    new Promise(res => {
        const timer = setTimeout(() => {
            clearTimeout(timer);
            res();
        }, ms);
    });

export function objToUrlParams(obj = {}) {
    const keys = Object.keys(obj).filter(key => obj[key] === 0 || !!obj[key]);
    const data = keys.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
    return data.join('&');
}

/**
 * 获取对象属性 getObjectProperty({a:{b:c{1}}}, 'a.b.c')
 * @param {object} theObject
 * @param {string} path
 * @param {string} separator
 */
export function getObjectProperty(theObject, path, separator) {
    try {
        separator = separator || '.';
        return path
            .replace('[', separator)
            .replace(']', '')
            .split(separator)
            .reduce(function(obj, property) {
                return obj[property];
            }, theObject);
    } catch (err) {
        return undefined;
    }
}

export function safaJsonParse(o) {
    try {
        return JSON.parse(o);
    } catch (ex) {
        return null;
    }
}

export const formatDuration = millis => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
export const formatPlayCount = count => {
    count = +count || 0;
    if (count < 1e5) return count;
    return `${Math.ceil(count / 1e4)}万`;
};

export const isMobile = /mobile/i.test(window.navigator.userAgent);

export const eventMap = {
    dragStart: isMobile ? 'touchstart' : 'mousedown',
    dragMove: isMobile ? 'touchmove' : 'mousemove',
    dragEnd: isMobile ? 'touchend' : 'mouseup',
    mouseWheel: isMobile ? 'touchmove' : 'mousewheel'
};

// 格式化媒体持续时间
export function formatTime(time) {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
}

//
export function bindEvents(player, events) {
    Object.keys(events).forEach(eventItem => {
        player.addEventListener(eventItem, events[eventItem], false);
    });
}
export function removeEvents(player, events) {
    Object.keys(events).forEach(eventItem => {
        player.removeEventListener(eventItem, events[eventItem], false);
    });
}
