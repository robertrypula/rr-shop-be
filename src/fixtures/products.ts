import { ProductFixture } from '../model';

export const productFixtures: ProductFixture[] = [
  [
    ['Propolis', 'propolis', 14.99, 432, 'b-r'],
    [2],
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
    ['Balsam jerozolimski', 'balsam-jerozolimski', 25.0, 32, 'b-r'],
    [2],
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
    ['Krwiściąg', 'krwisciag', 9.99, 34, 'b-r'],
    [2, 11],
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
    ['Dziewanna', 'dziewanna', 7.5, 2, 'b-r'],
    [2, 12],
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
