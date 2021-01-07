import Route from "~/src/structures/routes/Route.js";

export default class SMS extends Route {
    constructor(main) {
        super(main);
    }

    get sms() {
        return this.modules.sms;
    }

    get route() {
        return '/sms';
    }

    /**
     * @param {Request} request 
     */
    async delete(request) {
        if (!await this.isSessionValid(request)) return request.reject(403);

        const body = await request.json();
        if (!body || !body.phoneNumber || !body.email) return request.reject(400);

        let userObj = await this.modules.user.models.getUser(body.email);
        delete userObj.phoneNumber

        if (!await this.modules.user.models.updateUser(userObj)){
            return request.reject(406, {
                code: 406,
                status: '406 - Not Acceptable',
                message: 'After Processing the Request Body the server did not find the content that was needed to complete the request.',
                data: json
            });
        }

        return request.accept(null, 202);
    }

    /**
     * @param {Request} request 
     */
    async get(request) {
        if (!await this.isSessionValid(request)) return request.reject(403);

        const knownNumbers = await this.modules.user.models.query({phoneNumber: { $exists: true }});

        return request.accept(knownNumbers);
    }

    /**
     * @param {Request} request 
     */
    async post(request) {
        if (!await this.isSessionValid(request)) return request.reject(403);

        const body = await request.json();
        if (!body || !body.phoneNumber || !body.email) return request.reject(400);

        let userObj = await this.modules.user.models.getUser(body.email);
        userObj.phoneNumber = body.phoneNumber;

        if (!await this.modules.user.models.updateUser(userObj)){
            return request.reject(406, {
                code: 406,
                status: '406 - Not Acceptable',
                message: 'After Processing the Request Body the server did not find the content that was needed to complete the request.',
                data: json
            });
        }

        return request.accept({ success: true }, 200);
    }
}