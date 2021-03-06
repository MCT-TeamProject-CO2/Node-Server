import BaseModule from './structures/BaseModule.js'
import fetch from 'node-fetch'

export default class Teams extends BaseModule {
    constructor(main) {
        super(main);

        this.register(Teams, {
            disabled: true,
            name: 'teams'
        });
    }

    /**
     * send a teams message to howest staff
     * @param {string} title 
     * @param {string} message 
     */
    async postMessageToTeams(title, message) {
        const card = {
            '@type': 'MessageCard',
            '@context': 'http://schema.org/extensions',
            themeColor: "0072C6", // light blue
            summary: 'Test Summary',
            sections: [
                {
                    activityTitle: title,
                    text: message,
                },
            ],
        };

        const body = JSON.stringify(card);

        const res = await fetch(this.WebHookUrl, {
            headers: {
                'Content-Type': 'application/vnd.microsoft.teams.card.o365connector',
                'Content-Length': `${body.length}`
            },
            method: 'POST',
            body
        });
        return res.ok;
    }

    async postAlertToTeams(alert){
        const title = `${alert.tagString} code ${'Red' ? code == 2 : 'Orange'}`;
        const message = `CO2: ${alert.co2} ppm \n Humidity: ${alert.humidity}% \n Temperature: ${alert.temperature}°C \n TVOC: ${alert.tvoc} ppb`;
        await this.postMessageToTeams(title, message);
    }

    async init() {
        this.WebHookUrl = this.auth.ms_teams.WebHookUrl;
        return true;
    }

}


// import pymsteams
// channel="https://studenthowest.webhook.office.com/webhookb2/276f5711-8096-4d28-8b4c-3390fd10aa42@4ded4bb1-6bff-42b3-aed7-6a36a503bf7a/IncomingWebhook/bb12bd4350c248f68351decb7fc1be4b/4e4d40df-20c9-4deb-88d1-e99a697d25a6"
// msg="This text is sent in Python - by TDC"
// myTeamsMessage = pymsteams.connectorcard(channel)
// myTeamsMessage.text(msg)
// myTeamsMessage.send()
