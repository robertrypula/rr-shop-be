import { createTransport } from 'nodemailer';
const { google } = require('googleapis');

// https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1

// tslint:disable:no-console

export const sendEmailSimple = (to: string, subject: string, html: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      '', // ClientID
      '', // Client Secret
      'https://developers.google.com/oauthplayground' // Redirect URL
    );

    oauth2Client.setCredentials({ refresh_token: '' });

    const accessToken = oauth2Client.getAccessToken();
    const smtpTransport = createTransport({
      auth: {
        accessToken,
        clientId: '',
        clientSecret: '',
        refreshToken: '',
        type: 'OAuth2',
        user: 'kontakt@waleriana.pl'
      },
      service: 'gmail'
    });

    const mailOptions = { from: 'Waleriana.pl <kontakt@waleriana.pl>', generateTextFromHTML: true, html, subject, to };

    smtpTransport.sendMail(mailOptions, (error: Error | null, response: any): void => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
      smtpTransport.close();
    });
  });
};
