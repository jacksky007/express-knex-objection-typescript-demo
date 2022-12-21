import { Model } from 'objection'

import { knex } from '../knex'

Model.knex(knex)

export interface User {
  id: number
  name: string
}

export class User extends Model {
  static get tableName() {
    return 'users'
  }
}
