import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();

const development = {
    client: 'pg',
    connection: process.env.POSTGRESQL_URI
}

const db = knex(development);

export default db;