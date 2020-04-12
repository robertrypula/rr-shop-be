import { createReadStream } from 'fs';
import { join } from 'path';
import { Attachment } from '../simple-gmail/models';

const footerImage001Cid = 'footer.image.001';

export const DEFAULT_ATTACHMENTS: Attachment[] = [
  {
    cid: footerImage001Cid,
    content: createReadStream(join(__dirname, '/footer-image-001.png')),
    filename: 'footer-image-001.png'
  }
];

export const ORDER_ITEM = `
  <tr>
    <td width="25" valign="top" style="vertical-align: top;">
      {{ COUNTER }}.
    </td>
    <td width="315" valign="top" style="vertical-align: top;">
      <b>{{ NAME }}</b>
    </td>
    <td width="160" valign="top" style="vertical-align: top; text-align: right">
      {{ QUANTITY }} x {{ PRICE_UNIT_ORIGINAL }} zł = {{ PRICE_TOTAL_ORIGINAL }} zł
    </td>
  </tr>
`;

export const PAYMENT_BANK_TRANSFER = `
  <p>
    Zanim zajmiemy się jego kompletowaniem prosimy o dokonanie płatności poprzez
    przelew bankowy.
  </p>
  <p>
    Numer konta: <strong>0000-1111-2222-3333-4444-5555-6666-7777-8888</strong>
    <br/>
    Tytuł przelewu: <strong>{{ NUMBER }}</strong>
  </p>
`;

export const PAYMENT_PAY_U = `
  <p>
    Zanim zajmiemy się jego kompletowaniem prosimy o dokonanie płatności elektronicznej:
  </p>
  <p>
    <a href="{{ PAY_U_URL }}" target="_blank"><strong>Płatność PayU</strong></a>
  </p>
`;

export const PRICE_WITHOUT_PROMO_CODE = `
  <p>
    Do zapłaty: <strong>{{ PRICE_TOTAL_SELLING }} zł</strong>
  </p>
`;

export const PRICE_WITH_PROMO_CODE = `
  <p>
    Do zapłaty (z uwzględnieniem {{ DISCOUNT }}% zniżki): <strong>{{ PRICE_TOTAL_SELLING }} zł</strong>
  </p>
`;

export const DELIVERY_IN_POST_COURIER: string = `
  <p>
    Po zaksięgowaniu wpłaty paczka zostanie dostarczona kurierem InPost na adres:
    <br/>
    <strong>
      {{ NAME }} {{ SURNAME }}
      <br/>
      {{ ADDRESS }}
      <br/>
      {{ ZIP_CODE }} {{ CITY }}
    </strong>
  </p>
`;

export const DELIVERY_IN_POST_PARCEL_LOCKER: string = `
  <p>
    Po zaksięgowaniu wpłaty paczka zostanie dostarczona do paczkomatu InPost: <strong>{{ PARCEL_LOCKER }}</strong>
  </p>
`;

export const DELIVERY_OWN: string = `
  <p>
    Po zaksięgowaniu wpłaty, o możliwości <strong>odbioru osobistego</strong> poinformujemy Cię osobnym mailem.
  </p>
`;

/*
    <p>
        W każdej chwili możesz podglądnąć aktualny stan zamówienia klikając w poniższy link:
        <br/>
        <a href="{{ ORDER_URL }}"><strong>Podgląd zamówienia</strong></a>
    </p>
 */

export const DEFAULT: string = `
<html lang="pl">
  <head>
    <meta charset="utf-8" />
  </head>
  <body>
    <div style="font-family: Arial, serif; font-size: 12px; line-height: 16px; color: #2c2c2c;">
      <p>
        Witaj {{ NAME }},
        <br/>
        przyjęliśmy Twoje zamówienie do realizacji i nadaliśmy mu numer <strong>{{ NUMBER }}</strong>.
      </p>

      <table width="500" cellpadding="0" cellspacing="0" border="0">
        <tbody>
          {{ ORDER_ITEMS }}
        </tbody>
      </table>

      {{ PAYMENT }}
      {{ PRICE }}
      {{ DELIVERY }}

      <p>
        Pozdrawiamy
      </p>
    </div>

    <table width="400" cellpadding="0" cellspacing="0" border="0">
      <tbody>
        <tr>
          <td width="2" bgcolor="#7e5a79" style="background-color: #7e5a79; font-size: 1px;">&nbsp;</td>
          <td width="16" style="font-size: 1px;">&nbsp;</td>
          <td width="382" valign="top" style="vertical-align: top;">
            <div style="font-family: arial, sans-serif; font-weight: normal;">
              <table width="380" cellpadding="0" cellspacing="0" border="0">
                <tbody>
                  <tr>
                    <td style="padding: 0 0 10px 0;">
                      <div style="font-size: 12px; line-height: 16px;">
                        <b style="color: #7e5a79;">+48 739 907 730</b>
                        <br />
                        <a href="mailto:kontakt@waleriana.pl" style="color: #1155cc;">kontakt@waleriana.pl</a>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 0 0 10px 0;">
                      <img
                        alt="waleriana logo"
                        width="290"
                        height="94"
                        style="display: block;"
                        src="cid:${footerImage001Cid}"
                      />
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div style="font-size: 11px; line-height: 16px;">
                        <div style="color: #2c2c2c;">
                          <a href="https://waleriana.pl" style="color: #1155cc;">waleriana.pl</a> Monika Ozimina Joanna
                          Rypuła s.c.
                        </div>
                        <div style="color: #777777;">
                          ul. Tarnogajska 18 lok. 102, 50-515 Wrocław
                          <br />
                          NIP:8992876342 REGON:385536848
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`;
