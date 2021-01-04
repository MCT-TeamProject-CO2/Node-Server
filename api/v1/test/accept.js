import Route from '~/src/structures/routes/Route.js'

/**
 * Route: /api/v1/test/accept
 */
export default class AcceptTest extends Route {
    /**
     * @param {Main} main The program entrypoint class
     */
    constructor(main) {
        super(main);
    }

    get route() {
        return '/accept';
    }

    /**
     * If a get request comes in this method is called
     * @param {Request} request 
     */
    get(request) {
        return request.accept('If you see this message, then it works.');
    }
}