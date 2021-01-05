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


    async init() {

        // let message = this.createMessages("32476067619", "test123");
        // let test = await this.sendTextMessages(message);
        return true;
    }

    /**
     * 
     * @param {Array<string>|string} numbers 
     * @param {string} messages 
     */
    createMessages(numbers, message) {
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
}