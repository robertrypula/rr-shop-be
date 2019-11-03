import 'reflect-metadata';

import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import { Connection, createConnection } from 'typeorm';

import { entities } from './entity';
import { migrations } from './migration';
import { routes } from './routes';

/*tslint:disable:no-console*/

createConnection({
  database: 'database.sqlite',
  entities,
  logging: true,
  migrations,
  migrationsRun: true,
  synchronize: true,
  type: 'sqlite'
})
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
