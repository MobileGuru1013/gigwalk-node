// @flow
import axios from 'axios';
import stringify from 'json-stable-stringify';
import type { Axios, $AxiosXHR, $AxiosXHRConfig } from 'axios';

interface Request<T> extends $AxiosXHRConfig<T> {
    success: Function,
    error: Function
}

interface ActiveRequestRecord<T> {
    request: Request<T>,
    promise: Promise<T>
}

export default class RequestQueue {

    // Queue of requests awaiting dispatch
    dispatchQueue: Array<Request<*>> = [];

    // Map of all pending requests
    activeRequests: Map<string, ActiveRequestRecord<*>> = new Map();

    client: Axios;

    constructor(client?: Axios = axios) {
        this.client = client;
    }

    /**
     * Adds a request to the RequestQueue. Returns a promise that is resolved or rejected when
     * the request completes.
     * @param config
     * @returns {Promise}
     */
    add(config: $AxiosXHRConfig<*>): Promise<$AxiosXHR<*>> {
        const request: Request<*> = {
            url: config.url,
            success: () => {},
            error: () => {}
        };

        // Note: To pass type checking, manual assignment of maybe types is required. See https://github.com/facebook/flow/issues/2167
        if (config.data) request.data = config.data;
        if (config.method) request.method = config.method;
        if (config.auth) request.auth = config.auth;
        if (config.progress) request.progress = config.progress;
        if (config.maxContentLength) request.maxContentLength = config.maxContentLength;
        if (config.maxRedirects) request.maxRedirects = config.maxRedirects;
        if (config.headers) request.headers = config.headers;
        if (config.params) request.params = config.params;
        if (config.paramsSerializer) request.paramsSerializer = config.paramsSerializer;
        if (config.responseType) request.responseType = config.responseType;
        if (config.transformResponse) request.transformResponse = config.transformResponse;
        if (config.transformRequest) request.transformRequest = config.transformRequest;
        if (config.timeout) request.timeout = config.timeout;
        if (config.validateStatus) request.validateStatus = config.validateStatus;
        if (config.withCredentials) request.withCredentials = config.withCredentials;
        if (config.xsrfCookieName) request.xsrfCookieName = config.xsrfCookieName;
        if (config.xsrfHeaderName) request.xsrfHeaderName = config.xsrfHeaderName;
        if (config.httpAgent) request.httpAgent = config.httpAgent;
        if (config.httpsAgent) request.httpsAgent = config.httpsAgent;

        const key = stringify(request);

        if (this.activeRequests.has(key)) {
            const record = this.activeRequests.get(key);
            if (record) {
                return record.promise;
            }
        }

        // Create a promise that we can return immediately. Since the dispatch happens
        // asynchronously, we won't have the axios promise to return.
        const promise = new Promise((resolve: Function, reject: Function) => {
            // Attach the resolve and reject functions to the request so that
            // we can fulfill/reject the promise when the request completes.
            request.success = resolve;
            request.error = reject;
        });

        this.activeRequests.set(key, { request, promise });

        this.dispatchQueue.push(request);
        if (this.dispatchQueue.length === 1) {
            setTimeout(() => this.checkQueue(), 1);
        }

        return promise;
    }

    checkQueue() {
        if (this.dispatchQueue.length > 0) {
            const request = this.dispatchQueue.shift();
            const promise = this.client(request);

            // Add then/catch to the promise chain so that we can fulfill/reject
            // the promise returned by RequestQueue.add().
            promise
                .then((...args: Array<any>) => request.success(...args))
                .catch((...args: Array<any>) => request.error(...args))
                .then(() => {
                    const key = stringify(request);
                    this.activeRequests.delete(key);
                });

            setTimeout(() => this.checkQueue(), 1);
        }
    }

    cancel() {
        // No API exists for cancelling active HTTP requests yet
        // See https://github.com/whatwg/fetch/issues/27 and https://github.com/mzabriskie/axios/issues/50
    }

    cancelAll() {
        // No API exists for cancelling active HTTP requests yet
        // See https://github.com/whatwg/fetch/issues/27 and https://github.com/mzabriskie/axios/issues/50
    }
}
