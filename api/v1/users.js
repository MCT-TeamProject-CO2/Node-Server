import Route from '~/src/structures/routes/Route.js'

/**
 * Route: /api/v1/users
 */
export default class Users extends Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '/users';
    }

    get model() {
        return this.modules.user.model;
    }

    /**
     * Disable a specific user
     * @param {Rquest} request 
     */
    async delete(request) {
        if (!await this.isSessionValid(request, 'admin')) return request.reject(403);

        const body = await request.json();
        if (!body) return request.reject(400);

        const user = await this.model.disableUser(body, false);
        delete user.password;

        await this.modules.mail.sendUserDisabledMail(user.email);

        const sessions = this.modules.session.sessions;
        sessions.forEach((session, name) => {
            if (session.uid == user.uid) sessions.delete(name);
        });

        await this.modules.session.model.revokeSessionsForUserId(user.uid);

        return request.accept(
            user,
            200
        );
    }

    /**
     * Return all the registered users
     * @param {Request} request 
     */
    async get(request) {
        if (!await this.isSessionValid(request)) return request.reject(403);

        const searchParams = new URLSearchParams(request.searchParams);
        const me = searchParams.has('me');

        if (me) {
            const session = await this.modules.session.getSession(request.headers['authorization']);

            return request.accept(session.user);
        }

        if (!await this.isSessionValid(request, 'admin')) return request.reject(403);

        return request.accept(
            await this.model.getUsers({})
        );
    }

    /**
     * Create a new user
     * @param {Request} request 
     */
    async post(request) {
        if (!await this.isSessionValid(request, 'admin')) return request.reject(403);

        const body = await request.json();
        if (!body) return request.reject(400);

        try {
            await this.model.createUser(body);
            await this.modules.mail.sendUserCreatedMail(body.email);
            return request.accept('', 201);
        } catch (error) {
            return request.reject(406, {
                code: 406,
                status: "406 - Not Acceptable",
                message: error.message
            });
        }
    }

    /**
     * Update a user
     * @param {Request} request 
     */
    async put(request) {
        if (!await this.isSessionValid(request, 'admin')) return request.reject(403);

        const body = await request.json();
        if (!body || !body.query || !body.update) return request.reject(400);
        
        try {        
            await this.modules.mail.sendUserUpdatedMail(body.email);
            return request.accept(
                await this.model.updateUser(body.query, body.update)
            );
        } catch (error) {
            return request.reject(406, {
                code: 406,
                status: "406 - Not Acceptable",
                message: error.message
            });
        }
    }
}