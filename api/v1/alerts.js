import Route from '~/src/structures/routes/Route.js'

export default class Alerts extends Route {
    constructor(main) {
        super(main);
    }

    get model() {
        return this.modules.alert.model;
    }

    get route() {
        return '/alerts';
    }

    /**
     * 
     * @param {Request} request 
     */
    async get(request) {
        if (!await this.isSessionValid(request)) return request.reject(403);

        const searchParams = new URLSearchParams(request.searchParams);

        const delta = searchParams.get('delta');
        const start = searchParams.get('start');
        const end = searchParams.get('end');

        let docs;

        if (!start && !end) {
            const date = new Date();
            date.setMinutes(date.getMinutes() - (!delta || isNaN(delta) ? 20 : delta));

            docs = await this.model.findBetweenDates(date);
        }
        else if (delta && (start || end)) return request.reject(400);
        else if (start && end) {
            if (isNaN(start) || isNaN(end)) return request.reject(400);

            docs = await this.model.findBetweenDates(
                new Date(parseInt(start)),
                new Date(parseInt(end))
            );
        }

        return request.accept(docs);
    }
}