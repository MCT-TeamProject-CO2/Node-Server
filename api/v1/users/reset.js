import Route from '~/src/structures/routes/Route.js'
import crypto from 'crypto'

/**
 * Route: /api/v1/users
 */
export default class ResetUserPassword extends Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '/reset';
    }

    get model() {
        return this.modules.user.model;
    }

    /**
     * Create a new user
     * @param {Request} request 
     */
    async post(request) {
        if (!this.isSessionValid(request, 'admin')) return request.reject(403);

        const body = await request.json();
        if (!body) return request.reject(400);

        const session = await this.modules.session.getSession(request.headers.authorization);
        const target = await this.model.getUser(body.query);

        if (!target) return request.accept({
            success: false,
            data: 'The given user could not be found.'
        });

        // Checks if the permission level of the current session is smaller than the target
        if (!session.isValid(target.permission)) return request.accept({
            success: false,
            data: 'You can\'t target a user of a higher permission level than yourself.'
        });

        const randomPass = crypto.randomBytes(32).toString('base64');

        try {
            await this.model.updateUser(body.query, { password: randomPass });

            await this.modules.mail.sendUserResetMail(target.email, randomPass);

            return request.accept({
                success: true
            });
        } catch (error) {
            return request.reject(406, {
                code: 406,
                status: "406 - Not Acceptable",
                message: error.message
            });
        }
    }
}