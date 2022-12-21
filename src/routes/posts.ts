import { Router } from 'express'
import {
  getCommentsOnPage,
  listPosts,
  showPost,
  showPostAndCommentsOnPage,
} from '../controllers/post'

const postsRouter = Router()

// redirect to the first post
postsRouter.get('/', listPosts)

// HTML: render post and comments on page 1
postsRouter.get('/:postId', showPost)

// JSON: get comments of post on page X
postsRouter.get('/:postId/comments/p:commentsPageId.json', getCommentsOnPage)

// HTML: render post and comments on page X
postsRouter.get('/:postId/comments/p:commentsPageId', showPostAndCommentsOnPage)

export { postsRouter }
