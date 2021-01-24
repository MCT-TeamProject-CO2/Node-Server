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

    async sendUserResetMail(email, password) {
        const transporter = this.createTransporter(this.config);
        const verified = this.verifyTransporter(transporter);

        if (verified) {
            const message = await this.createMessage(
                this.modules.mail.sender,
                email,
                "Password Reset",
                "An administrator has reset your Howest Air Quality account.\r\nTry logging in again with the following credentials.\r\nEmail: " + email + "\r\nPassword: "+ password + "\r\n\r\nAfter logging in you should go to settings to reset your password to something you can remember.",
                "An administrator has reset your Howest Air Quality account. <br/><br/>Try logging in again with the following credentials.<br/>Email: <b>" + email + "</b><br/>Password: <b>"+ password + "</b><br/><br/>After logging in you should go to settings to reset your password to something you can remember."       
            );

            const result = await this.sendMail(transporter, message);
        }
    }

    async sendUserDisabledMail(email) {
        const transporter = this.createTransporter(this.config);
        const verified = this.verifyTransporter(transporter);

        if(verified) {
            const message = await this.createMessage(this.sender, email, "Disabled Account", "Your account has been disabled from accessing the Howest Air Quality Dashboard.", "Your account has been disabled from accessing the Howest Air Quality Dashboard.");
            const result = await this.sendMail(transporter, message);
        }
    }

    async sendUserCreatedMail(email) {
        const transporter = this.createTransporter(this.config);
        const verified = this.verifyTransporter(transporter);

        if(verified) {
            const message = await this.createMessage(this.sender, email, "Created Account", "An account has been created on the Howest Air Quality Dashboard with this email.", "An account has been created on the Howest Air Quality Dashboard with this email.");
            const result = await this.sendMail(transporter, message);
        }
    }

    async sendUserUpdatedMail(email) {
        const transporter = this.createTransporter(this.config);
        const verified = this.verifyTransporter(transporter);

        if(verified) {
            const message = await this.createMessage(this.sender, email, "Updated Account", "Your Howest Air Quality account has been updated.", "Your Howest Air Quality account has been updated.");
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