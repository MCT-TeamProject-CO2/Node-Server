import Route from '~/src/structures/routes/Route.js'

/**
 * Route: /api/v1/users
 */
export default class Users extends Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '';
    }

    get model() {
        return this.modules.user.model;
    }

    /**
     * Disable a specific user
     * @param {Rquest} request 
     */
    async delete(request) {
        if (!await this.isSessionValid(request)) return request.reject(403);

        const body = await request.json();
        if (!body) return request.reject(400);

        return request.accept(
            await this.model.disableUser(body),
            200
        );
    }

    /**
     * Return all the registered users
     * @param {Request} request 
     */
    async get(request) {
        if (!await this.isSessionValid(request)) return request.reject(403);

        return request.accept(
            await this.model.getUsers({})
        );
    }

    /**
     * Create a new user
     * @param {Request} request 
     */
    async post(request) {
        if (!await this.isSessionValid(request)) return request.reject(403);

        const body = await request.json();
        if (!body) return request.reject(400);

        try {
            await this.model.createUser(body);

            return request.accept('', 201);
        } catch (error) {
            console.log(error);

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
        if (!await this.isSessionValid(request)) return request.reject(403);

        const body = await request.json();
        if (!body || !body.query || !body.update) return request.reject(400);
        
        try {        
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