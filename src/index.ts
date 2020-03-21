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

createConnection({
  ...{
    // database: 'database.sqlite',
    // type: 'sqlite'

    // https://stackoverflow.com/questions/11407349/how-to-export-and-import-a-sql-file-from-command-line-with-options
    database: 'waleriana',
    host: 'localhost',
    password: 'mysql',
    port: 3306,
    type: 'mysql',
    username: 'root'
  },
  ...{
    dropSchema: true,
    logging: false,
    synchronize: true
  },
  ...{
    entities,
    migrations,
    migrationsRun: true
  }
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
