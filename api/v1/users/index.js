import Route from '~/src/structures/routes/Route.js'
import bcrypt from 'bcrypt'

/**
 * Route: /api/v1/users
 */
export default class Users extends Route {
    constructor(main) {
        super(main);
    }

    get route() {
        return '';
    }

    get model() {
        return this.modules.user.model;
    }

    /**
     * Disable a specific user
     * @param {Rquest} request 
     */
    async delete(request) {
        if (!await this.isSessionValid(request, 'admin')) return request.reject(403);

        const body = await request.json();
        if (!body) return request.reject(400);

        const user = await this.model.disableUser(body, false);
        delete user.password;

        await this.modules.mail.sendUserDisabledMail(user.email);

        const sessions = this.modules.session.sessions;
        sessions.forEach((session, name) => {
            if (session.uid == user.uid) sessions.delete(name);
        });

        await this.modules.session.model.revokeSessionsForUserId(user.uid);

        return request.accept(
            user,
            200
        );
    }

    /**
     * Return all the registered users
     * @param {Request} request 
     */
    async get(request) {
        if (!await this.isSessionValid(request)) return request.reject(403);

        const searchParams = new URLSearchParams(request.searchParams);
        const me = searchParams.has('me');

        if (me) {
            const session = await this.modules.session.getSession(request.headers['authorization']);

            return request.accept(
                await this.model.getUser({ uid: session.uid })
            );
        }

        if (!await this.isSessionValid(request, 'admin')) return request.reject(403);

        return request.accept(
            await this.model.getUsers({})
        );
    }

    /**
     * Create a new user
     * @param {Request} request 
     */
    async post(request) {
        if (!await this.isSessionValid(request, 'admin')) return request.reject(403);

        const body = await request.json();
        if (!body) return request.reject(400);

        const session = this.modules.session.getSession(request.headers.authorization);
        if (!session.isValid(body.permission)) return request.reject(403);

        let description;
        if (body.type === 'normal') {
            const randomPass = crypto.randomBytes(32).toString('base64');
            body.password = randomPass;

            description = `An administrator has added you to the Howest Air Quality Dashboard.\r\n\r\nYour login credentials are:\r\nEmail: ${body.email}\r\nPassword: ${randomPass}`;
        }
        else {
            delete body.username;
            delete body.password;

            description = `An administrator has added you to the Howest Air Quality Dashboard.\r\n\r\nYou must use your Microsoft account associated with this email to login.`;
        }

        try {
            await this.model.createUser(body);
            await this.modules.mail.sendUserCreatedMail(body.email, description);

            return request.accept('', 201);
        } catch (error) {
            return request.reject(406, {
                code: 406,
                status: "406 - Not Acceptable",
                message: error.message
            });
        }
    }

    /**
     * Update a user
     * @param {Request} request 
     */
    async put(request) {
        if (!await this.isSessionValid(request)) return request.reject(403);

        const body = await request.json();
        if (!body || !body.query || !body.update) return request.reject(400);
        
        const session = await this.modules.session.getSession(request.headers['authorization']);
        const user = session.user;

        const docToUpdate = await this.model.getUser(body.query, true);
        const updateSelf = user.email == body.query.email
            || user.username == body.query.username
            || user.uid == body.query.uid;
        if (body.update.password) {
            if (updateSelf) {
                if (!body.update.old_password) {
                    return request.accept({
                        success: false,
                        data: 'Please give your old password to update your password.'
                    });
                }

                if (!await bcrypt.compare(body.update.old_password, docToUpdate.password)) return request.accept({
                    success: false,
                    message: 'Password not updated, the given old password did not match what was stored.'
                });

                delete body.update.old_password;
            }

            if (body.update.password.length < 6) return request.accept({
                success: false,
                message: 'New password is too short.'
            });
        }

        if (body.update.permission) {
            const permissionLevels = this.modules.user.constants.PermissionLevels;
            
            if (updateSelf) {
                if (permissionLevels.indexOf(session.permLevel) <= permissionLevels.indexOf(docToUpdate.permission)) return request.accept({
                    success: false,
                    message: 'You can\'t update your permission level to a higher level.'
                });
            }
            else {
                if (permissionLevels.indexOf(session.permLevel) < permissionLevels.indexOf(body.update.permission)) return request.accept({
                    success: false,
                    message: 'You can\'t update user permissions of others to a higher level than yours.'
                });
            }
        }

        try {
            const userSchema = await this.model.updateUser(body.query, body.update);
            await this.modules.mail.sendUserUpdatedMail(user.email);

            return request.accept({
                success: true,
                data: userSchema
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