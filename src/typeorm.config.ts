import { resolve } from 'path';
require('dotenv').config()

export = {
    type: "mariadb",
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [ resolve(__dirname, 'entities/**.entity.{ts,js}') ],
    migrations: [ resolve(__dirname, 'migrations/**.{ts,js}') ],
    migrationsRun: true,
    logging: false,
    cli: {
        migrationsDir: 'src/migrations',
        entitiesDir: 'src/entities',
    }
}