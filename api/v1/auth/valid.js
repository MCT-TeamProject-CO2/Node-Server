import Route from '~/src/structures/routes/Route.js'

export default class AuthValid extends Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '/valid';
    }

    /**
     * Returns if the session is still valid, this endpoint should not be relied on
     * but can inform the fronted if the session is no longer valid
     * @param {Request} request 
     */
    async get(request) {
        if (await this.isSessionValid(request)) return request.accept({
            valid: true
        });
        return request.accept({
            valid: false
        });
    }
}