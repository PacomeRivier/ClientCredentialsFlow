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
        console.log(authResponse.accessToken); // display access token
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authResponse.accessToken}`
            //'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiJhcGk6Ly8zMzdhNjhhMS03YzEyLTRiNzctYjViMi0wZTViYTEzOWY5YTciLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mYmFjZDQ4ZC1jY2Y0LTQ4MGQtYmFmMC0zMTA0ODM2ODA1NWYvIiwiaWF0IjoxNjI2MTgyNzUwLCJuYmYiOjE2MjYxODI3NTAsImV4cCI6MTYyNjE4NjY1MCwiYWlvIjoiRTJaZ1lGaHk4dXZTVW0ySjBQV2hDMk5mZkU3UkFRQT0iLCJhcHBpZCI6IjE1NTFlM2U0LWI3N2MtNDQ5ZS1iYzYxLTFlYzEzOGZhYjQ5NyIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2ZiYWNkNDhkLWNjZjQtNDgwZC1iYWYwLTMxMDQ4MzY4MDU1Zi8iLCJvaWQiOiI3ZTU1MzNjZC1kMTMwLTRlZWEtOWMwYS05NzEwZjdmOGM0MDEiLCJyaCI6IjAuQVNvQWpkU3MtX1RNRFVpNjhERUVnMmdGWC1UalVSVjh0NTVFdkdFZXdUajZ0SmNxQUFBLiIsInJvbGVzIjpbIldIT19JbnRlcm5hbF9EYXNoYm9hcmQiXSwic3ViIjoiN2U1NTMzY2QtZDEzMC00ZWVhLTljMGEtOTcxMGY3ZjhjNDAxIiwidGlkIjoiZmJhY2Q0OGQtY2NmNC00ODBkLWJhZjAtMzEwNDgzNjgwNTVmIiwidXRpIjoibWRhZEs2bWdfMGVjU0FrMmoxWjVBQSIsInZlciI6IjEuMCJ9.TYumNZ6FW5xavYhygZxzJ5lHzkzR34L1BxNdYYC0EKJlCb-NTIRqfS14O8uJ7yUtuiCkUKIiLiNC5N6Ac2byozOOZim8bUN2LvlDyUiv2tQEs7etXLeFSwrvIb68woujhMEdZlLsNowO3crbOMQvRo1mCt5nZrhvbSNj_tQX9HUDnBnnbk3zxP6_Ou2P0cX0-HzxemZPktfUq9AbiczBKX3WRPsfHyKL7zUm1IQsK0-mBivZ2SoR6MRlocCCjUiRH6dXqCRevsoaKG8uJdfkHPiX3aMP19ANhOEvMzNaoMLJfxyPH-1P3e415qbwD8cPe8REkJxYye2P2wpnt12lyg`
        };
        const path = `http://localhost:3000/graphql`;
        fetch(path, {
            method: 'post',
            headers,
            body: JSON.stringify({ "query": "query GetApplications {\napplications {    id \n  name  }  }" })
        }).catch(err => console.log('FETCH ERROR', err))
        .then(res => res.json())
        .then(json => console.log('JSON', json.data.applications));
    } catch (error) {
        console.log('ERROR', error);
    }
}

acquireToken();



