import Route from '~/src/structures/routes/Route.js'

export default class smartplugs extends Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '/smartplugs';
    }

     /**
     * 
     */
    async post(request) {
        if (!this.isSessionValid(request, 'admin')) return request.reject(403);

        try {
            await this.modules.smartplugs.getDevices()
            return request.accept();
        } catch (error) {
            return request.reject(406, {
                code: 406,
                status: "406 - Not Acceptable",
                message: error.message
            });
        }
    }
}