import BaseModule from './structures/BaseModule.js'
import fetch from 'node-fetch'

export default class SMS extends BaseModule {

    constructor(main) {
        super(main);

        this.register(SMS, {
            disabled: true,

            name: 'sms',
            requires: [ 'mongo' ]
        });
    }

    /**
     * 
     * @param {Array<string>|string} numbers 
     * @param {string} messages 
     */
    async createMessages(numbers, message) {
        let messages = [];
        if (numbers instanceof Array) {
            for(const number of numbers) {
                message = {
                    "channel": "sms",
                    "to": `${number}`,
                    "content": `${message}`
                }
                messages.push(message);
            }
        } else if (typeof(numbers) === 'string'){
            message = {
                "channel": "sms",
                "to": `${numbers}`,
                "content": `${message}`
            }
            messages.push(message);
        }
        return messages
    }

    /**
     * 
     * @param {Array<{
     *  channel: string,
     *  to: string,
     *  content: string
     * }>} messages 
     */
    async sendTextMessages(messages) {
        const res = await fetch('https://platform.clickatell.com/v1/message', {
            headers: {
                'Authorization': 'VmGMIQOQRryF3X8Yg-iUZw==',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ messages })
        });
        return res.ok;
    }

    async sendSmsAlerts(alert){
        const users = this.modules.user.model.getUsers();
        const numbers = [];
        for(const user of users){
            if (user.config.smsNotifications == true && user.phone_number){
                numbers.push(user.phone_number);
                }
            }

        const messages = await this.createMessages(numbers,
            `${alert.tagString} has reached CO2 levels of ${alert.co2} ppm.\r\n Code: ${'Red' ? code == 2 : 'Orange'}.\r\n Automatic ventilation is activated if available.`     
        );
        await sendTextMessages(messages);
    }
}