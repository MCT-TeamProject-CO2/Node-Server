import Route from '~/src/structures/routes/Route.js'
import fetch from 'node-fetch'

export default class oauth2 extends Route {
    constructor(main) {
        super(main);
    }
    
    get route() {
        return '/oauth2';
    }

    /**
     * @param {Request} request 
     */
    get(request) {
        const searchParams = new URLSearchParams(request.searchParams);

        const ms_oauth = this.auth.ms_oauth;
        const url = `https://login.microsoftonline.com/${ms_oauth.tenant}/oauth2/v2.0/authorize?\
client_id=${ms_oauth.clientId}&\
response_type=code&redirect_uri=${searchParams.redirect}\
&response_mode=query\
&scope=${ms_oauth.scopes.join('%20')}`;

        request.writeHead(301, {
            'Location': url,
            'Content-Type': 'text/html'
        });
        request.end(`<a href="${url}">Login</a>`);
    }

    /**
     * @param {Request} request 
     */
    async post(request) {
        const body = await request.json();
        if (!body || !body.code) return request.reject(400);

        const code = body.code;

        const tokenRequestBody = {
            client_id: this.auth.ms_oauth.clientId,
            scope: 'openid',
            redirect_uri: 'http://localhost:8080',
            client_secret: this.auth.ms_oauth.clientSecret,
            grant_type: 'authorization_code',
            code: code
        };
        
        let res = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            body: new URLSearchParams(tokenRequestBody).toString()
        });
        
        let json = await res.json();
        if (!res.ok) return request.reject(406, {
            code: 406,
            status: '406 - Not Acceptable',
            message: 'After Processing the Request Body the server did not find the content that was needed to complete the request.',
            data: json
        });

        const access_token = json.access_token;

        res = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${access_token}`
            },
            method: 'GET'
        });

        json = await res.json();
        if (!res.ok) return request.reject(406, {
            code: 406,
            status: '406 - Not Acceptable',
            message: 'After Processing the Request Body the server did not find the content that was needed to complete the request.',
            data: json
        });

        const email = json.userPrincipalName;

        const user = await this.modules.user.model.getUser({ email });
        if (!user) return request.reject(404);

        return request.accept({
            sessionId: await this.modules.session.createSession(user)
        });
    }
}