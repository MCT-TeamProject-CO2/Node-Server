import Route from '~/src/structures/routes/Route.js'

export default class Location extends Route {
    constructor(main) {
        super(main);
    }

    get model() {
        return this.modules.location.model;
    }

    get route() {
        return '/locations';
    }

    /**
     * 
     * @param {Request} request 
     */
    async get(request) {
        if (!await this.isSessionValid(request)) return request.reject(403);

        return request.accept(
            await this.model.getAll()
        );
    }

    /**
     * 
     * @param {Request} request 
     */
    async post(request) {
        if (!await this.isSessionValid(request, 'admin')) return request.reject(403);

        const body = await request.json();
        if (!body) return request.reject(400);

        try {
            await this.model.createIfNotExists(body);
        } catch (error) {
            return request.reject(406, {
                code: 406,
                status: "406 - Not Acceptable",
                message: error.message
            });
        }
        return request.accept('', 201);
    }

    /**
     * 
     * @param {Request} request 
     */
    async put(request) {
        if (!await this.isSessionValid(request, 'admin')) return request.reject(403);

        const body = await request.json();
        if (!body || !body.query || !body.update) return request.reject(400);

        try {
            return request.accept(
                await this.model.update(body.query, body.update)
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