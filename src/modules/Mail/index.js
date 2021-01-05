import BaseModule from './structures/BaseModule.js'
import nodemailer from 'nodemailer'
import MailModel from './structures/models/MailModel.js'

export default class Mail extends BaseModule {
    _cache = new Map();

    constructor(main) {
        super(main);

        this.register(Mail, {
            name: 'mail',
            requires: [ 'mongo' ],
            events: [
                {
                    mod: 'mongo',
                    name: 'ready',
                    call: '_updateConfigurations'
                }
            ]
        });
    }

    get models() {
        return MailModel;
    }

    /**
     * @private
     */
    async _updateConfigurations() {
        this._cache.clear();

        const configurations = await this.models.query({});

        for (const configuration of configurations) {
            this._cache.set(configuration.name, this.createTransporter(configuration));
        }

        this.log.info('MAILER', 'Updated mail configurations.');
    }

    /**
     * Create a transporter for a given config
     * @param {Object} config
     */
    createTransporter(config) {
        return nodemailer.createTransport(config);
    }

    /**
     * Create Mail Message to send
     * @param {string} sender 
     * @param {string} receiver 
     * @param {string} subject 
     * @param {string} plainTextMessage 
     * @param {string} htmlMessage 
     */
    async createMessage(sender, receiver, subject, plainTextMessage, htmlMessage){
        return {
            from: sender,
            to: receiver,
            subject: subject,
            text: plainTextMessage,
            html: htmlMessage
        };
    }

    /**
     * Sends a mail with a nodemailer transporter
     * @param {nodemailer.Transporter} transporter 
     * @param {{
     *  from: string,
     *  to: string,
     *  subject: string,
     *  text: string,
     *  html: string
     * }} message
     * @returns {
     *  result: boolean,
     *  data: Object|Error
     * } If true see => https://nodemailer.com/usage/#sending-mail
     */
    async sendMail(transporter, message) {
        try {
            return { result: true, data: await transporter.sendMail(message)};
        } catch (error) {
            return { result: false, data: error };
        }
    }

    /**
     * Verifiy a transporter
     * @param {nodemailer.Transporter} transporter 
     */
    verifyTransporter(transporter) {
        return transporter.verify();
    }
}