import { createReadStream } from 'fs';
import { join } from 'path';
import { Attachment } from '../simple-gmail/models';

export const footerImage001Cid = 'footer.image.001';

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
    Numer konta: <strong>0000-1111-2222-3333-4444-5555-6666-7777-8888</strong>
    <br/>
    Tytuł przelewu: <strong>{{ NUMBER }}</strong>
  </p>
`;

export const PAYMENT_PAY_U = `

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
