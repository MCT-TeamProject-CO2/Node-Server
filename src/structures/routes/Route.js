export default class Route {
    /**
     * @param {Main} main The program entrypoint class
     */
    constructor(main) {
        this._m = main;
    }

    get auth() {
        return this._m.auth;
    }

    get config() {
        return this._m.config;
    }

    get log() {
        return this._m.log;
    }

    get modules() {
        return this._m.modules;
    }
    
    get route() {
        throw new Error('The route of this endpoint has not been defined.');
    }

    /**
     * Checks if a session is valid
     * @param {Request} request
     * @returns {Promise<boolean>}
     */
    isSessionValid(request) {
        return this.modules.session.doesSessionExist(request.headers['authorization']);
    }
}