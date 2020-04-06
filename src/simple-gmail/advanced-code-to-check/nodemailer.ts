import { createTransport } from 'nodemailer';
import * as googleAuth from './google-auth';

const EMAIL_USERNAME: string = 'kontakt@waleriana.pl';
const COMMON_NAME: string = 'Waleriana.pl';

export const transport = createTransport({
  auth: {
    accessToken: googleAuth.tokens.access_token,
    clientId: googleAuth.credentials.web.client_id,
    clientSecret: googleAuth.credentials.web.client_secret,
    expires: googleAuth.tokens.expiry_date,
    refreshToken: googleAuth.tokens.refresh_token,
    type: 'OAuth2',
    user: EMAIL_USERNAME
  },
  from: `${COMMON_NAME} <${EMAIL_USERNAME}>`,
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  service: 'Gmail'
});
