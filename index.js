const msal = require('@azure/msal-node');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

const msalConfig = {
	auth: {
		clientId: process.env.CLIENT_ID,
		authority: process.env.AAD_ENDPOINT + process.env.TENANT_ID,
		clientSecret: process.env.CLIENT_SECRET,
	},
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
};

const cca = new msal.ConfidentialClientApplication(msalConfig);

const tokenRequest = {
    scopes: [process.env.SCOPE],
};

const acquireToken = async () => {
    try {
        const authResponse = await cca.acquireTokenByClientCredential(tokenRequest);
        console.log('TOKEN', authResponse.accessToken); 
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authResponse.accessToken}`
        };
        fetch(process.env.SAFE_API, {
            method: 'post',
            headers,
            // You can use any query from the GraqhQL API
            body: JSON.stringify({ "query": "query GetApplications {\napplications {    id \n  name  }  }" })
        }).catch(err => console.log('FETCH ERROR', err))
        .then(res => res.json())
        .then(json => console.log('APPLICATIONS', json.data.applications));
    } catch (error) {
        console.log('ERROR', error);
    }
}

acquireToken();
