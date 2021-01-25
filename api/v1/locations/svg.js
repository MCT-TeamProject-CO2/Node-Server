import Route from '~/src/structures/routes/Route.js'

export default class LocationFloorPlanSVG extends Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '/svg';
    }

    async get(request) {
        const search = new URLSearchParams(request.searchParams);

        if (!search.has('id')) request.reject(400);

        const doc = await this.modules.location.model.getSvgById(search.get('id'));

        if (doc?.svg) return request.accept(doc.svg.toString());

        return request.accept(null);
    }
}