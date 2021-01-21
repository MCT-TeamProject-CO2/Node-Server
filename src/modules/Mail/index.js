import BaseModule from './structures/BaseModule.js'
import nodemailer from 'nodemailer'
import MailModel from './structures/models/MailModel.js'

export default class Mail extends BaseModule {
    _cache = new Map();
    config;
    sender;

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

    get model() {
        return MailModel;
    }

    /**
     * @private
     */
    async _updateConfigurations() {
        this._cache.clear();

        const configurations = await this.model.query({});

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

    async sendUserDisabledMail(email){
        // const config = this.auth.mail;
        // const sender = config.email;
        // delete config.email;
        // console.log(config);
        const transporter = this.createTransporter(this.config);
        const verified = this.verifyTransporter(transporter);
        if(verified){
            const message = await this.createMessage(this.sender, email, "Disabled Account", "This account has been disabled from accessing Howest Air Quality Dashboard.", "This account has been disabled from accessing Howest Air Quality Dashboard.");
            const result = await this.sendMail(transporter, message);
        }
    }

    async sendUserCreatedMail(email){
        // const config = this.auth.mail;
        // const sender = config.email;
        // delete config.email;
        // console.log(config);
        const transporter = this.createTransporter(this.config);
        const verified = this.verifyTransporter(transporter);
        if(verified){
            const message = await this.createMessage(this.sender, email, "Created Account", "An account with this email has been created on Howest Air Quality Dashboard.", "An account with this email has been created on Howest Air Quality Dashboard.");
            const result = await this.sendMail(transporter, message);
        }
    }

    async sendUserUpdatedMail(email){
        // const config = this.auth.mail;
        // const sender = config.email;
        // delete config.email;
        // console.log(config);
        const transporter = this.createTransporter(this.config);
        const verified = this.verifyTransporter(transporter);
        if(verified){
            const message = await this.createMessage(this.sender, email, "Updated Account", "This Howest Air Quality account has been updated.", "This Howest Air Quality account has been updated.");
            const result = await this.sendMail(transporter, message);
        }
    }

    async init(){
        const tempconfig = this.auth.mail;
        this.sender = tempconfig.email;
        delete tempconfig.email;
        this.config = tempconfig;
        return true;
    }

}