import Route from '~/src/structures/routes/Route.js'

export default class MqttDisconnect extends Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '/mqtt_disconnect';
    }

    /**
     * @param {Request} request 
     */
    async get(request) {
        if (!await this.isSessionValid(request)) return request.reject(403);

        const searchParams = new URLSearchParams(request.searchParams);

        const delta = searchParams.get('delta');
        const start = searchParams.get('start');
        const end = searchParams.get('end');

        if (!start && !end) {
            const date = new Date();

            date.setMinutes(date.getMinutes() - delta ? delta : 10);
            
            return request.accept(
                await this.modules.logging.model.getDelta(date)
            );
        }
        else if (delta && (start || end)) return request.reject(400);
        else if (start && end) {
            if (isNaN(start) || isNaN(end)) return request.reject(400);

            const startDate = new Date(parseInt(start));
            const endDate = new Date(parseInt(end));

            return request.accept(
                await this.modules.logging.model.getInRange(startDate, endDate)
            );
        }        
    }



    /**
     * @param {Request} request 
     */
    async post(request) {
        const body = await request.json();
        if (!body || !body.message) return request.reject(400);

        this.modules.logging.push('warning', 'data_handler', 'The Python data handler encountered an error:', body.message);

        return request.accept('', 204);
    }
}