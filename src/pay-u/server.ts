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
  return (Math.random() * 9999).toString().substr(1, 3);
};

const getExtOrderId = () => {
  return `WA-${getRandomNumbers()}-${getRandomNumbers()}`;
};

router.get('/', async (req, res) => {
  try {
    simplePayU
      .order({
        client: {
          email: 'robert.rypula@gmail.com',
          phone: '+48 000 111 222',
          firstName: 'Robert',
          lastName: 'Rypuła',
          language: 'pl'
        },
        customerIp: req.ip,
        extOrderId: getExtOrderId(),
        totalAmount: 123,
        validityTime: 2 * 3600
      })
      .then(response => {
        res.send(`
          <pre>${JSON.stringify(response, null, 2)}</pre>
          <a href="${response.redirectUri}">place order</a>
        `);
      });
  } catch (error) {
    console.log(error);
  }
});

router.post('/notify', bodyParser.text({ type: '*/*' }), async (req, res) => {
  let notification;

  try {
    notification = simplePayU.handleNotification(req.headers, req.body);
  } catch (error) {
    res.status(400).send({ error: 'Wrong signature' });
    return;
  }
  console.log(notification);
  // getOrder(notification.extOrderId).changeStatus(notification.status).save();

  res.status(200);
});

const app = express();

app.use('/', router);
app.listen(8080);

console.log('Server started');
