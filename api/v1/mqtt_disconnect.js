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
    async post(request) {
        const body = await request.json();
        if (!body || !body.message) return request.reject(400);

        this.modules.logging.push('warning', 'data_handler', 'The Python data handler encountered an error:', body.message);

        return request.accept('', 204);
    }
}