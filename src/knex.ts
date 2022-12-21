import knexFn, { Knex } from 'knex'
import * as path from 'path'

export const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: path.join(__dirname, '../db/db.dev.sqlite3'),
    },
  },

  production: {
    client: 'better-sqlite3',
    connection: {
      filename: path.join(__dirname, '../db/db.prod.sqlite3'),
    },
  },
}

// epxort knex instance
const env = process.env.NODE_ENV === 'production' ? 'production' : 'development'
export const knex = knexFn(config[env])
