/* eslint-disable @typescript-eslint/no-require-imports */
require('@testing-library/jest-dom');

// Minimal Request polyfill so Next's server Request import does not throw in Jest
if (typeof global.Request === 'undefined') {
	global.Request = class Request {
		constructor(input, init) {
			this.url = typeof input === 'string' ? input : input?.url || '';
			this.method = init?.method || 'GET';
			this.headers = {};
			if (init?.headers) {
				if (init.headers instanceof Headers) {
					init.headers.forEach((v, k) => (this.headers[k] = v));
				} else {
					Object.assign(this.headers, init.headers);
				}
			}
		}
	};
}

if (typeof global.Response === 'undefined') {
	global.Response = class Response {
		constructor(body, init = {}) {
			this._body = body;
			this.status = init.status || 200;
			this.headers = init.headers || {};
		}
		async json() {
			if (typeof this._body === 'string') return JSON.parse(this._body);
			return this._body;
		}
		async text() {
			if (typeof this._body === 'string') return this._body;
			return JSON.stringify(this._body);
		}
	};
}
// static helper similar to WHATWG Response.json used by Next
if (typeof global.Response.json !== 'function') {
	global.Response.json = (body, init) => new global.Response(body, init);
}
