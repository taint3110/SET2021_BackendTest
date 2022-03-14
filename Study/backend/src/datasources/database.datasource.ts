import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {configs} from './constant';
const config = {
  name: 'database',
  connector: 'mongodb',
  url: configs.MONGODB_URL,
  host: 'localhost',
  port: 27017,
  user: 'root',
  password: 'password',
  database: 'dev',
  useNewUrlParser: true,
  roles: [ "readWrite", "dbAdmin" ]
};

@lifeCycleObserver('datasource')
export class DatabaseDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'database';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.database', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
