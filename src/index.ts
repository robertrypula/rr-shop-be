import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import { Connection, createConnection } from 'typeorm';

import { routes } from './routes';

createConnection()
  .then(async (connection: Connection) => {
    const app = express();

    app.use(bodyParser.json());
    app.use(cors());
    app.use(helmet());

    app.use('/', routes);

    app.listen(3000, () => {
      console.log('Server started on port 3000!');
    });
  })
  .catch(error => console.log(error));
