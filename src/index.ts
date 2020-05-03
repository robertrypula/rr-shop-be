import 'reflect-metadata';

import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import { Connection, createConnection } from 'typeorm';

import { getSecretConfig } from './config';
import { entities } from './entity';
import { migrations } from './migration';
import { SecretConfig } from './models/models';
import { routes } from './routes';
import { RecurringTasksService } from './services/recurring-tasks/recurring-tasks.service';

const secretConfig: SecretConfig = getSecretConfig();
let recurringTasksService: RecurringTasksService;

// tslint:disable:no-console

createConnection({
  ...{
    // https://stackoverflow.com/questions/11407349/how-to-export-and-import-a-sql-file-from-command-line-with-options
    ...{
      bigNumberStrings: true,
      supportBigNumbers: false,
      type: 'mysql'
    },
    ...{
      database: secretConfig.mySql.database,
      host: secretConfig.mySql.host,
      password: secretConfig.mySql.password,
      port: secretConfig.mySql.port,
      username: secretConfig.mySql.username
    }
  },
  ...{
    dropSchema: secretConfig.typeOrm.dropSchema, // TODO !!! disable on PROD !!!
    logging: secretConfig.typeOrm.logging,
    migrationsRun: secretConfig.typeOrm.migrationsRun, // probably always 'true'
    synchronize: secretConfig.typeOrm.synchronize // TODO !!! disable on PROD !!!
  },
  ...{
    entities,
    migrations
  }
})
  .then(async (connection: Connection) => {
    const app = express();

    app.use(cors());
    app.use(helmet());

    app.use('/', routes);

    app.listen(3000, () => {
      console.log('Server started on port 3000!');

      setInterval(async () => {
        recurringTasksService = recurringTasksService ? recurringTasksService : new RecurringTasksService();
        await recurringTasksService.sendEmails();
      }, 8000);
    });
  })
  .catch(error => console.log(error));
