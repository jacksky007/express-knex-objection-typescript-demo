import { Model } from 'objection'

import { knex } from '../knex'

import { User } from './user'

Model.knex(knex)

export interface Comment {
  id: number
  content: string
  author: User
}

export class Comment extends Model {
  static get tableName() {
    return 'comments'
  }

  static get relationMappings() {
    return {
      author: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'comments.user_id',
          to: 'users.id',
        },
      },
    }
  }
}
