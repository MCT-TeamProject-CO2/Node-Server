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
        const body = await request.json();
        if (!body || (!body.username && !body.email) || !body.password) return request.reject(400);

        const password = body.password;
        delete body.password;

        const user = await this.modules.user.model.getUser(body);

        if (!await this.modules.session.verifyHash(password, user.password)) {
            return request.reject(401);
        }

        return request.accept({
            sessionId: await this.modules.session.createSession(user)
        });
    }
}