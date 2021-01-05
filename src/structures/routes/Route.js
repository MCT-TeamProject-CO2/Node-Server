export default class Route {
    /**
     * @param {Main} main The program entrypoint class
     */
    constructor(main) {
        this._m = main;
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
}