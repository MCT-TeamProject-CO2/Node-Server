export default class Route {
    /**
     * @param {Main} main The program entrypoint class
     */
    constructor(main) {

    }
    
    get route() {
        throw new Error('The route of this endpoint has not been defined.');
    }
}