import * as googleAuth from 'google-auth-library';
import { Credentials } from 'google-auth-library/build/src/auth/credentials';

const scope: string = 'https://mail.google.com/';

// tslint:disable:no-console

/**
 * Step 0: Create OAuth2 credentials at the Google Console
 * (make sure to download JSON, not only just get key and secret)
 */

export const credentials = {
  web: {
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    client_id: '',
    client_secret: '',
    project_id: '',
    redirect_uris: ['https://developers.google.com/oauthplayground'],
    token_uri: 'https://oauth2.googleapis.com/token'
  }
};

/**
 * Step 1: Authorize in the browser
 */

export function getAuthorizeUrl(callback: (err: any, url: string) => any): void {
  const oauth2Client = new googleAuth.OAuth2Client(
    credentials.web.client_id,
    credentials.web.client_secret,
    credentials.web.redirect_uris[0]
  );
  const authUrl = oauth2Client.generateAuthUrl({ access_type: 'offline', scope });

  callback(null, authUrl);
}

/**
 * Step 2: Get auth token
 */

// Paste in your one-time use authorization code here
const code: string = '4/x..........';

export function getAccessToken(callback: (err: any, token?: Credentials | null) => any): void {
  const oauth2Client = new googleAuth.OAuth2Client(
    credentials.web.client_id,
    credentials.web.client_secret,
    credentials.web.redirect_uris[0]
  );

  oauth2Client.getToken(code, (error, token) => {
    if (error) {
      return console.log(error);
    }

    callback(null, token);
  });
}

/**
 * Step 3: Save access and refresh tokens as an export for Nodemailer
 */

// Paste your credentials here as this object.
export const tokens: Credentials = {
  access_token:
    '.......',
  expiry_date: 1583189086079,
  token_type: 'Bearer'
};
