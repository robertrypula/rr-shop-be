// import { sendEmailAdvanced } from './gmail/advanced';

import 'reflect-metadata';

import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import { Connection, createConnection } from 'typeorm';

import { entities } from './entity';
import { migrations } from './migration';
import { routes } from './routes';

// tslint:disable:no-console

declare const PRODUCTION: boolean;
declare const DEVELOPMENT: boolean;

try {
  console.log(typeof PRODUCTION, PRODUCTION);
  console.log(typeof DEVELOPMENT, DEVELOPMENT);
} catch (e) {
  console.log(e);
}

createConnection({
  database: 'database.sqlite',
  dropSchema: true,
  entities,
  logging: false,
  migrations,
  migrationsRun: true,
  synchronize: true,
  type: 'sqlite'
})
  .then(async (connection: Connection) => {
    const app = express();

    app.use(cors());
    app.use(helmet());

    app.use('/', routes);

    app.listen(3000, () => {
      console.log('Server started on port 3000!');
    });
  })
  .catch(error => console.log(error));
