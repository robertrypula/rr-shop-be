import { createTransport } from 'nodemailer';
const { google } = require('googleapis');
import { createReadStream } from 'fs';
import { join } from 'path';

import { Settings } from './models';

// https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1

// tslint:disable:object-literal-sort-keys
// tslint:disable:no-console

export class SimpleGmail {
  protected settings: Settings;

  protected readonly redirectUri = 'https://developers.google.com/oauthplayground';

  public constructor(settings: Settings) {
    this.settings = { ...settings };
  }

  public send(to: string, subject: string, html: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const OAuth2 = google.auth.OAuth2;
      const oAuth2Client = new OAuth2(this.settings.clientId, this.settings.clientSecret, this.redirectUri);

      oAuth2Client.setCredentials({ refresh_token: this.settings.refreshToken });

      const accessToken = oAuth2Client.getAccessToken();
      const smtpTransport = createTransport({
        auth: {
          type: 'OAuth2',
          user: this.settings.user,
          clientId: this.settings.clientId,
          clientSecret: this.settings.clientSecret,
          refreshToken: this.settings.refreshToken,
          accessToken
        },
        service: 'gmail'
      });

      const mailOptions = {
        from: this.settings.from,
        to,
        subject,
        html,
        generateTextFromHTML: true,
        attachments: [
          {
            cid: 'footer.image.001',
            content: createReadStream(join(__dirname, '/email-signature-128.png')),
            filename: 'email-signature-128.png'
          }
        ]
      };

      smtpTransport.sendMail(mailOptions, (error: any, response: any): void => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
        smtpTransport.close();
      });
    });
  }
}
