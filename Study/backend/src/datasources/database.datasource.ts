import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
require('dotenv').config();
const config = {
  name: 'database',
  connector: 'mongodb',
  url: "mongodb://root:password@localhost:27017/dev?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false",
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
