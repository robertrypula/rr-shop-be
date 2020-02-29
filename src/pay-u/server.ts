import * as bodyParser from 'body-parser';
import * as express from 'express';

import { Environment, Headers } from './models';
import { SimplePayU } from './simple-pay-u';

const simplePayU = new SimplePayU({
  clientId: '',
  clientSecret: '',
  continueUrl: 'http://waleriana.pl', // in case of error: ?error=501
  currencyCode: 'PLN',
  environment: Environment.Sandbox,
  merchantPosId: '',
  notifyUrl: 'https://api.waleriana.pl/pay-u/notify',
  secondKey: ''
});

const getRandomNumbers = () => {
  return (Math.random() * 9999 + 1000).toString().substr(1, 3);
};

const getExtOrderId = () => {
  return `WA-${getRandomNumbers()}-${getRandomNumbers()}`;
};

const router = express.Router();

router.get('/pay-u', async (req, res) => {
  try {
    const orderResponse = await simplePayU.createOrder({
      buyer: {
        email: 'robert.rypula@gmai#@l.com',
        firstName: 'Robert',
        language: 'pl',
        lastName: 'Rypuła',
        phone: '+48 000 111 222'
      },
      customerIp: req.ip,
      extOrderId: getExtOrderId(),
      totalAmount: 2343,
      validityTime: 2 * 3600
    });

    res.send(`
     <pre>${JSON.stringify(orderResponse, null, 2)}</pre>
     <a href="${orderResponse.redirectUri}">place order</a>
    `);
  } catch (error) {
    res.send(error);
  }
});

router.get('/pay-u/notify', bodyParser.text({ type: '*/*' }), async (req, res) => {
  try {
    const notification = simplePayU.getNotification(req.headers as Headers, req.body);

    res.send(`<pre>${JSON.stringify(notification, null, 2)}</pre>`);
  } catch (error) {
    res.send(error);
  }
});

const app = express();

app.use('/', router);
app.listen(8080);

console.log('Server started');
