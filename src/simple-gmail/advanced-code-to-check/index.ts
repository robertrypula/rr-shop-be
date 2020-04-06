import * as googleAuth from './google-auth';
import * as nodemailerConfig from './nodemailer';

// https://designdigitalsolutions.com/sending-mail-via-nodemailer-using-your-gmail-with-oauth2/
// https://github.com/designink-digital/nodemailer_gmail_oauth2_example/tree/master/src

// tslint:disable:no-console

/* Step 1 */
// googleAuth.getAuthorizeUrl((error, url) => {
//   if (error) {
//     return console.log(error);
//   }
//   console.log('Auth url is: ', url);
// });

/* Step 2 */
// googleAuth.getAccessToken((error, token) => {
//   if (error) {
//     return console.log(error);
//   }
//   console.log('Auth token is: ', token);
// });

/* Step 3 */
export const sendEmailAdvanced = (to: string, subject: string, html: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const mailOptions = { from: 'Waleriana.pl <kontakt@waleriana.pl>', generateTextFromHTML: true, html, subject, to };

    nodemailerConfig.transport.sendMail(mailOptions, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
      nodemailerConfig.transport.close();
    });
  });
};
