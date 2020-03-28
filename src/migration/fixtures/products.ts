import { DeliveryType, PaymentType, ProductFixture } from '../../models/product.model';
import { BARDZO_DOBRZE, DELIVERIES, DOBRZE, HERBATY, PAYMENTS } from './categories';

export const productFixtures: ProductFixture[] = [
  [['Odbiór osobisty', '', 0.0, 1000000, '', DeliveryType.Own, null], [DELIVERIES], [], ``],
  [['Paczkomaty', '', 8.99, 1000000, '', DeliveryType.Paczkomaty, null], [DELIVERIES], [], ``],
  [['Kurier', '', 12.0, 1000000, '', DeliveryType.Courier, null], [DELIVERIES], [], ``],
  [['Przelew bankowy', '', 0.0, 1000000, '', null, PaymentType.BankTransfer], [PAYMENTS], [], ``],
  [['Płatność elektroniczna PayU', '', 0.5, 1000000, '', null, PaymentType.PayU], [PAYMENTS], [], ``],
  [
    ['Propolis', 'propolis', 14.99, 432, 'b-r', null, null],
    [HERBATY],
    ['propolis-front.jpg'],
    `
      <p>
        Propolis, czyli kit pszczeli w medycynie ludowej od dawna był stosowany jako środek
        bakteriobójczy, przeciwwirusowy i przeciwgrzybiczny. Ponadto używano go do regeneracji
        skóry i do miejscowych znieczuleń.
      </p>
    `
  ],
  [
    ['Balsam jerozolimski', 'balsam-jerozolimski', 25.0, 32, 'b-r', null, null],
    [HERBATY],
    ['balsam-jerozolimski-front.jpg'],
    `
      <p>
        Balsam Jerozolimski to suplement diety przeznaczony do stosowania w celu wsparcia
        odporności i układu oddechowego. Produkt przeznaczony dla osób dorosłych i dzieci powyżej 12. roku życia.
      </p>
      <strong>Szczegóły</strong>
      <p>
        Balsam Jerozolimski jest preparatem zawierającym ekstrakty z 11 ziół oraz witaminę C, które
        wykazują działanie wspomagające odporność i działanie układu oddechowego: zatok, gardła, oskrzeli.
      </p>
    `
  ],
  [
    ['Krwiściąg', 'krwisciag', 9.99, 34, 'b-r', null, null],
    [HERBATY, DOBRZE],
    ['krwisciag-front.jpg', 'krwisciag-back.jpg', 'krwisciag-liscie.jpg'],
    `
      <p>
        Krwiściąg lekarski ma liczne właściwości i zastosowania. Może wspomagać leczenie schorzeń skórnych, takich jak
        trądzik, egzemy czy owrzodzenia błon śluzowych. Sprawdza się także przy umiarkowanych problemach z przewodem
        pokarmowym i guzkach krwawniczych.
      </p>
    `
  ],
  [
    ['Dziewanna', 'dziewanna', 7.5, 2, 'b-r', null, null],
    [HERBATY, BARDZO_DOBRZE],
    ['dziewanna-front.jpg', 'dziewanna-liscie.jpg'],
    `
      <p>
        Dziewanna znalazła zastosowanie w ziołolecznictwie. Dzięki swoim prozdrowotnym właściwościom może
        wspomagać leczenie chorób górnych dróg oddechowy i dróg żółciowych. Stosuje się ją także przy
        zaburzeniach miesiączkowania.
      </p>
    `
  ]
];
