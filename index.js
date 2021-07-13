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
            //'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiJkNjIwODNkOC1mZGMwLTRhNmEtODYxOC02NTIzODBlZWJkYjkiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vZmJhY2Q0OGQtY2NmNC00ODBkLWJhZjAtMzEwNDgzNjgwNTVmL3YyLjAiLCJpYXQiOjE2MjYxNjAzMzEsIm5iZiI6MTYyNjE2MDMzMSwiZXhwIjoxNjI2MTY0MjMxLCJhaW8iOiJBVFFBeS84VEFBQUFVbS9jVmZxSnlEWmNpSzVVRnNtcTJINUN3RG5neTNUcXRaOFZlQ0hoMGphM2gyNUZ1cDBXVjFHOG1RbGRiWCsvIiwibmFtZSI6IlBhY29tZSBSaXZpZXIiLCJub25jZSI6ImFmOGIwMzNjLWRkMWMtNDg1NC1iOGQ4LTE2YjE3YzIyMmYyZiIsIm9pZCI6IjJmOTRjOGQyLWEzMWEtNDViMS1hZmQ5LTk4NDM2M2NiNTFjMiIsInByZWZlcnJlZF91c2VybmFtZSI6InBhY29tZUByZWxpZWZhcHBsaWNhdGlvbnMub3JnIiwicmgiOiIwLkFTb0FqZFNzLV9UTURVaTY4REVFZzJnRlg5aURJTmJBX1dwS2hoaGxJNER1dmJrcUFMOC4iLCJzdWIiOiJ2REdxbldJdi1iUjA2NlY2NkdIUWRvdnRBamMwTDFpYUNQc2htTC11YXdnIiwidGlkIjoiZmJhY2Q0OGQtY2NmNC00ODBkLWJhZjAtMzEwNDgzNjgwNTVmIiwidXRpIjoiTHQ0RmU4QU04RWluRFlTTDlIMGFBQSIsInZlciI6IjIuMCJ9.Wa82zQKl7obhsxG2uWmhxAlihCmQU_0drRuXVE4IZs_7Q5Z1UkIFtYEe78Hf2RNCzNPbOjo5eu3sDCOxVBu-LABWyOC0qWANyC1Vlla87kD7GNtA9EiIKwy46C2gnmRH0i66nxsfbDRPBzax_pZER4VRgRHs7IVGbFtaAe9Mduv0JqXQKUObWbfdaAIo2dHya6msZtowMgTy49TgLuHbpl6lDzXmWFAKk-m044rUUNXGXztKJdS7QtneOnkwB88rNZ7wtZ_6Qy-deDg3xZxU_utTSPrGHhmUGq4swguQYi2WmL1BUCbgI9ZHsv_9yJkyUbCkcshxNNstOIOV3lCaSw'
        };
        const path = `http://localhost:3000/graphql`;
        fetch(path, {
            method: 'post',
            headers,
            body: JSON.stringify({ "query": "query GetApplications {\napplications {    id \n  name  }  }" })
        }).catch(err => console.log('FETCH ERROR', err))
        .then(res => res.json())
        .then(json => console.log('JSON', json));
    } catch (error) {
        console.log('ERROR', error);
    }
}

acquireToken();



