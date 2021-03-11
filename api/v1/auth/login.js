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
        if (!this.modules.settings.ready) return request.accept({
            success: false,
            data: 'Try logging in again later.'
        });
        // Check if normal logging in is disabled
        if (this.modules.settings.cache.config.disableNormalLogin) return request.accept({
            success: false,
            data: 'Normal login has been disable by system administrators, try logging in with your Microsoft account.'
        });

        const body = await request.json();
        if (!body || (!body.username && !body.email) || !body.password) return request.reject(400);

        const password = body.password;
        delete body.password;

        const user = await this.modules.user.model.getUser(body, true);
        if (!user) return request.accept({
            success: false,
            data: 'Unknown username/email given or invalid password entered.'
        });

        if (user.disabled) return request.accept({
            success: false,
            data: 'Your account has been disabled, contact an administrator if you think this was a mistake.'
        });

        if (!await this.modules.session.verifyHash(password, user.password)) return request.accept({
            success: false,
            data: 'Unknown username/email given or invalid password entered.'
        });

        const session = await this.modules.session.createSession(user);
        return request.accept({
            success: true,
            data: {
                sessionId: session.id
            }
        });
    }
}