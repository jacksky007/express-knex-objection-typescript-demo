import { Model } from 'objection'

import { knex } from '../knex'
import { Comment } from './comment'

import { User } from './user'

Model.knex(knex)

export interface Post {
  id: number
  title: string
  content: string
  author: User
  comments: Comment[]
}

export class Post extends Model {
  static get tableName() {
    return 'posts'
  }

  static get relationMappings() {
    return {
      author: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'posts.user_id',
          to: 'users.id',
        },
      },
      comments: {
        relation: Model.HasManyRelation,
        modelClass: Comment,
        join: {
          from: 'posts.id',
          to: 'comments.post_id',
        },
      },
    }
  }
}
