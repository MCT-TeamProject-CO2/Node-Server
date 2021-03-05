import Route from "~/src/structures/routes/Route.js";

export default class Settings extends Route {
    constructor(main) {
        super(main);
    }

    get settings() {
        return this.modules.settings;
    }

    /**
     * Route: /api/v1/settings
     */
    get route() {
        return '';
    }

    /**
     * @param {Request} request 
     */
    async get(request) {
        if (!this.isSessionValid(request, 'admin')) return request.reject(403);

        return request.accept(
            await this.settings.model.query()
        );
    }

    /**
     * @param {Request} request 
     */
    async post(request) {
        if (!this.isSessionValid(request, 'admin')) return request.reject(403);

        const body = await request.json();
        if (!body) return request.reject(400);

        try {
            const configuration = await this.settings.model.update(body);
            await this.modules.settings.updateCache();

            return request.accept(configuration);
        } catch (error) {
            return request.reject(406, {
                code: 406,
                status: "406 - Not Acceptable",
                message: error.message
            });
        }
    }
}