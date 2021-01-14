import Route from "~/src/structures/routes/Route.js";

export default class Settings extends Route {
    constructor(main) {
        super(main);
    }

    get settings() {
        return this.modules.settings;
    }

    get route() {
        return '/settings';
    }

    /**
     * @param {Request} request 
     */
    async get(request) {
        if (!await this.isSessionValid(request, 'admin')) return request.reject(403);

        const settings = await this.settings.models.query();

        return request.accept(settings);
    }

    /**
     * @param {Request} request 
     */
    async post(request) {
        if (!await this.isSessionValid(request, 'admin')) return request.reject(403);

        const body = await request.json();
        if (!body || (!body.config && !body.email)) return request.reject(400);

        const configurations = await this.settings.models.update(body);

        return request.accept(configurations);
    }
}