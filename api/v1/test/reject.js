import Route from '~/src/structures/routes/Route.js'

/**
 * Route: /api/v1/test/reject
 */
export default class RejectTest extends Route {
    /**
     * @param {Main} main The program entrypoint class
     */
    constructor(main) {
        super(main);
    }

    get route() {
        return '/reject';
    }

    get(request) {
        return request.reject(403);
    }
}