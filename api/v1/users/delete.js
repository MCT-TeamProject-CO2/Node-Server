import Route from '~/src/structures/routes/Route.js'
import bcrypt from 'bcrypt'

/**
 * Route: /api/v1/users/delete
 */
export default class DeleteUser extends Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '/delete';
    }

    get model() {
        return this.modules.user.model;
    }

    /**
     * Create a new user
     * @param {Request} request 
     */
    async delete(request) {
        if (!await this.isSessionValid(request, 'root')) return request.reject(403);

        const body = await request.json();
        if (!body || !body.query || !body.password) return request.reject(400);

        const session = await this.modules.session.getSession(request.headers.authorization);

        const currUser = await this.model.getUser({ uid: session.uid }, true);
        if (!await bcrypt.compare(body.password, currUser.password)) return request.reject(403);

        try {
            await this.model.deleteUser(body.query);

            return request.accept('', 204);
        } catch (error) {
            return request.reject(406, {
                code: 406,
                status: "406 - Not Acceptable",
                message: error.message
            });
        }
    }
}