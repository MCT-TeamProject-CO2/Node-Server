import Route from '~/src/structures/routes/Route.js'

export default class Login extends Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '/login';
    }

    /**
     * @param {Request} request 
     */
    async post(request) {
        // Check if the settings module has a cache available
        if (!this.modules.settings.ready) return request.reject(403);
        // Check if normal logging in is disabled
        if (this.modules.settings.cache.config.disableNormalLogin) return request.reject(403);

        const body = await request.json();
        if (!body || (!body.username && !body.email) || !body.password) return request.reject(400);

        const password = body.password;
        delete body.password;

        const user = await this.modules.user.model.getUser(body, true);
        if (!user || user.disabled) request.reject(403);

        if (!await this.modules.session.verifyHash(password, user.password)) {
            return request.reject(403);
        }

        return request.accept({
            sessionId: await this.modules.session.createSession(user)
        });
    }
}