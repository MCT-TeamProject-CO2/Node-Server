import Route from "~/src/structures/routes/Route.js";

export default class Mail extends Route {
    constructor(main) {
        super(main);
    }

    get mail() {
        return this.modules.mail;
    }

    get route() {
        return '/mail';
    }

    /**
     * @param {Request} request 
     */
    async delete(request) {
        const body = await request.json();
        if (!body) return request.reject(400);

        await this.mail.models.remove(body);

        return request.accept(null, 204);
    }

    /**
     * @param {Request} request 
     */
    async get(request) {
        const configurations = await this.mail.models.query({});

        return request.accept(configurations);
    }

    /**
     * @param {Request} request 
     */
    async post(request) {
        const body = await request.json();
        if (!body) return request.reject(400);

        const transporter = this.mail.createTransporter(body.config);

        try {
            await this.mail.verifyTransporter(transporter);
        } catch (error) {
            return request.accept({
                success: false,
                message: error.message
            });
        }

        if (!await this.mail.models.createIfNotExists(body)) {
            return request.accept({ success: false, message: 'There already exists a mail configuration with the given name.' });
        }

        return request.accept({ success: true }, 200);
    }
}