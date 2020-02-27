// PayU code heavily simplified and migrated to TypeScript from vanilla JavaScript implementation:
// https://github.com/adambuczek/node-payu

// TODO fix disabled tslint issues
/*tslint:disable:no-console*/
/*tslint:disable:object-literal-sort-keys*/
/*tslint:disable:*/

import { SimplePayU } from './simple-pay-u';

const bodyParser = require('body-parser');
const express = require('express');

const error = (err: any) => {
  console.log(err);
};

const router = express.Router();

const settings = {
  posId: '',
  posDesc: 'Point of sales description',
  posCurrency: 'PLN',
  clientId: '',
  clientSecret: '',
  signatureKey: '',
  environment: 'sandbox',
  notifyUrl: 'https://api.waleriana.pl/notify',
  continueUrl: 'http://waleriana.pl' // in case of error: ?error=501
};
const simplePayU = new SimplePayU(settings);

router.get('/', async (req, res) => {
  try {
    simplePayU
      .order({
        products: [{ name: 'Zamówienie numer xxxxxx', unitPrice: 123, quantity: 1 }],
        customerIp: req.ip,
        extOrderId: Math.floor(Math.random() * 100000) + 10,
        client: {
          email: 'robert.rypula@gmail.com',
          phone: '+48 000 111 222',
          firstName: 'Robert',
          lastName: 'Rypuła',
          language: 'pl'
        }
      })
      .then(response => {
        console.log(response);
        // if (response.status.statusCode !== 'SUCCESS') console.error(response);
        // order.changeStatus('CREATED').save().then(() => {
        res.send(`<a href="${response.redirectUri}">place order</a>`);
        // });
      });
  } catch (e) {
    error(e);
  }
});

router.post(
  '/notify',
  bodyParser.text({ type: '*/*' }),
  async (req, res) => {
    let notification;

    try {
      notification = simplePayU.handleNotification(req.headers['openpayu-signature'], req.body);
    } catch (e) {
      error(e);
    }

    if (!notification) {
      throw new Error('Wrong signature.');
    }

    // getOrder(notification.extOrderId).changeStatus(notification.status).save();

    res.status(200);
  }
);

const app = express();

app.use('/', router);
app.listen(8080);

console.log('Server started');
