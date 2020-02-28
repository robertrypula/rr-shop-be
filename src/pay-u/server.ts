// PayU code heavily simplified and migrated to TypeScript from vanilla JavaScript implementation:
// https://github.com/adambuczek/node-payu

// TODO fix disabled tslint issues
/*tslint:disable:no-console*/
/*tslint:disable:object-literal-sort-keys*/
/*tslint:disable:*/

import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Environment } from './models';
import { SimplePayU } from './simple-pay-u';

const router = express.Router();
const simplePayU = new SimplePayU({
  clientId: '',
  clientSecret: '',
  continueUrl: 'http://waleriana.pl', // in case of error: ?error=501
  currencyCode: 'PLN',
  environment: Environment.Sandbox,
  merchantPosId: '',
  notifyUrl: 'https://api.waleriana.pl/notify',
  secondKey: ''
});

const getRandomNumbers = () => {
  return (Math.random() * 9999 + 1000).toString().substr(1, 3);
};

const getExtOrderId = () => {
  return `WA-${getRandomNumbers()}-${getRandomNumbers()}`;
};

router.get('/pay-u', async (req, res) => {
  try {
    const orderResponse = await simplePayU.createOrder({
      buyer: {
        email: 'robert.rypula@gmai#@l.com',
        phone: '+48 000 111 222',
        firstName: 'Robert',
        lastName: 'Rypuła',
        language: 'pl'
      },
      customerIp: req.ip,
      extOrderId: getExtOrderId(),
      totalAmount: 2343,
      validityTime: 2 * 3600
    });

    console.log('SUCESS', orderResponse);
    res.send(`
     <pre>${JSON.stringify(orderResponse, null, 2)}</pre>
     <a href="${orderResponse.redirectUri}">place order</a>
    `);
  } catch (error) {
    console.log('---ERROR', error);
    res.send(``);
  }
});

router.get('/pay-u/notify', bodyParser.text({ type: '*/*' }), async (req, res) => {
  const notification = simplePayU.getNotification(req.headers, req.body);

  if (notification) {
    res.status(200);
  } else {
    res
      .status(400)
      .contentType('application/json')
      .send({ error: 'Wrong signature' });
  }
});

const app = express();

app.use('/', router);
app.listen(8080);

console.log('Server started');
