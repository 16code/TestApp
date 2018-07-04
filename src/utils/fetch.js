import { types as ajaxTypes } from 'reducers/ajax';
import { delay, objToUrlParams } from 'utils/index';
import fetchIntercept from 'utils/fetch-intercept';
import { store } from '../containers/Store';
const API_GATEWAY = '/api';
const POST_HTTP_METHODS = ['POST', 'DELETED', 'PUT', 'PATCH'];

/**
 * fetch 拦截器 fetch(url, options)
 * @example
 * get 示例 fetch('path/to/url', { params: paramObj })
 * post示例 fetch('path/to/url', { method: 'POST',  body: paramObj })
 */
const pendingRequest = [];

fetchIntercept.register({
    request: function(url, cfg = {}) {
        const baseConfig = {
            method: 'GET',
            credentials: 'same-origin',
            mode: 'cors',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json; charset=utf-8'
            }
        };
        if (!isHttpUrl(url)) {
            url = `${API_GATEWAY}${/^\//.test(url) ? url : `/${url}`}`;
        }

        const config = Object.assign({}, baseConfig, cfg);
        const { method, body, headers, params } = config;
        if (POST_HTTP_METHODS.includes(method.toUpperCase()) && body) {
            config.body = headers['Content-Type'].includes('urlencoded')
                ? (config.body = objToUrlParams(body))
                : JSON.stringify(body);
        }
        if (params) {
            url = `${url}?${objToUrlParams(params)}`;
        }

        if (pendingRequest.length === 0) {
            store.dispatch({ type: ajaxTypes.ajaxRequest });
        }
        pendingRequest.push(url);
        return [url, config];
    },

    requestError: function(error) {
        return Promise.reject(error);
    },

    response: async function(response, requestArgs) {
        pendingRequest.shift();
        const status = response.status;
        if (pendingRequest.length === 0) {
            await delay(300);
            store.dispatch({ type: ajaxTypes.ajaxDone });
        }
        return new Promise((resolve, reject) => {
            switch (true) {
                case status >= 200 && status < 300:
                    handleResponseOk(response).then(data => {
                        resolve(data);
                    });
                    break;
                default:
                    handleResponseError(response, requestArgs)
                        .then(reject)
                        .catch(reject);
                    break;
            }
        });
    },

    responseError: function(error) {
        // Handle an fetch error
        return Promise.reject(error);
    }
});

function handleResponseOk(response) {
    return handleResponseData(response)
        .then(res => res)
        .catch(errs => errs);
}

function handleResponseError(response, requestArgs) {
    return response
        .json()
        .then(json => handleErrorData({ response, json, requestArgs }))
        .catch(() => handleErrorData({ response, requestArgs }));
}
function handleResponseData(response) {
    const contentType = response.headers.get('content-type');

    if (!contentType) {
        return response.text();
    }

    if (contentType.includes('application/json')) {
        return response.json();
    }
    return response.blob();
}

function handleErrorData({ response, json, requestArgs }) {
    const { url, status, statusText } = response;
    const errorInfo = {
        apiInfo: { url, requestArgs, status, statusText },
        pageInfo: {
            origin: window.location.origin,
            pathname: window.location.pathname,
            title: document.title
        },
        status,
        statusText,
        msg: null
    };
    if (response.status >= 500) {
        errorInfo.msg = response.statusText;
    } else if (json) {
        if (Array.isArray(json)) {
            json.forEach(err => {
                errorInfo.msg = err.error_description;
            });
        } else {
            errorInfo.msg = json.error_description;
        }
    }
    return errorInfo;
}

function isHttpUrl(url) {
    const urlRegex = /^http(s)?|^\/\//;
    return urlRegex.test(url);
}
