import { HttpResponseCode } from '../../util/Constants.js'

export default class Request {
    /**
     * @param {Server} webserver
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     */
    constructor(webserver, req, res) {
        Object.assign(this, {
            webserver,
            req,
            res
        });
    }

    get method() {
        return this.req.method.toLowerCase();
    }

    get url() {
        return this.req.url;
    }

    /**
     * Accept the connection, indicating everything went correctly and return some data.
     * @param {string|Object} data The data to return
     * @param {number} code Http response code
     */
    accept(data = '', code = 200) {
        if (code < 200 || code > 299) {
            throw new Error('The response code is outside the supported range, please use a 4XX or 5XX for errors.');
        }

        const headers = this.webserver.getHeaders(this.req);

        if (data instanceof Object) {
            headers['Content-Type'] = 'application/json';
            data = JSON.stringify(data);
        }

        this.writeHead(code, headers);
        this.end(data);

        return true;
    }
    
    /**
     * Rejects the request with an non 200 HTTP code
     * @param {number} code 
     * @param {string|Object} data 
     */
    reject(code, data = null) {
        const headers = this.webserver.getHeaders(this.req);

        if (code === 500 || data) {
            if (!data) {
                throw new Error('No data passed with request#reject');
            }

            if (data instanceof Object) {
                headers['Content-Type'] = 'application/json';
                data = JSON.stringify(data);
            }

            this.writeHead(code, headers);
            this.end();

            return true;
        }

        const res = HttpResponseCode[code];
        if (!res) {
            // this.reject(500, 'While processing a client side error a server side error occurred.');

            throw new Error('The HTTP response code you\'ve given has not been defined, add it to "src/modules/WebServer/util/Constants.js"');
        }

        headers['Content-Type'] = 'application/json';

        this.writeHead(code, headers);
        this.end(JSON.stringify(res));

        return true;
    }

    /**
     * Basic Helpers
     */
    end(...a) {
        this.res.end(...a);
    }

    write(...a) {
        this.res.write(...a);
    }

    writeHead(...a) {
        this.res.writeHead(...a);
    }
}