import Route from '~/src/structures/routes/Route.js'

export default class Revoke extends Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '/revoke';
    }

    /**
     * Revoke a session ID
     * @param {Request} request 
     */
    async delete(request) {
        const body = await request.json();
        if (!body || !body.sessionId) return request.reject(400);

        this.modules.session.revokeSession(body.sessionId);

        return request.accept('', 202);
    }
}