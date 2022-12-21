import { Request, Response } from 'express'

import { Comment } from '../models/comment'
import { Post } from '../models/post'
import { formatDatetimeFromNow } from '../utils/datetime'
import { getPostCommentsPageUrl } from '../utils/url'

const commentsPageSize = 100

async function showPostAndComments(req: Request, res: Response) {
  const postId = Number(req.params.postId)
  const commentsPageId = Number(req.params.commentsPageId) || 1

  const [post, comments, totalComments] = await Promise.all([
    Post.query().findById(postId).withGraphJoined('author'),
    Comment.query()
      .where('post_id', postId)
      .withGraphJoined('author')
      .offset(commentsPageSize * (commentsPageId - 1))
      .limit(commentsPageSize),
    Comment.query().where('post_id', postId).resultSize(),
  ])

  res.render('posts/show', {
    pageTitle: `Post ${postId}: ${post?.title}`,
    post,
    comments: {
      pageSize: commentsPageSize,
      pageId: commentsPageId,
      totalPages: Math.ceil(totalComments / commentsPageSize),
      items: comments,
    },
    formatDatetimeFromNow,
    getPostCommentsPageUrl,
  })
}

export async function listPosts(req: Request, res: Response) {
  const post = await Post.query().first()
  res.redirect(`/posts/${post?.id}`)
}

export async function showPost(req: Request, res: Response) {
  await showPostAndComments(req, res)
}

export async function getCommentsOnPage(req: Request, res: Response) {
  const commentsPageId = Number(req.params.commentsPageId)
  const [totalComments, comments] = await Promise.all([
    Comment.query().where('post_id', req.params.postId).resultSize(),
    Comment.query()
      .where('post_id', req.params.postId)
      .withGraphJoined('author')
      .limit(commentsPageSize)
      .offset(commentsPageSize * (commentsPageId - 1)),
  ])

  res.json({
    totalComments,
    pageSize: commentsPageSize,
    pageId: commentsPageId,
    totalPages: Math.ceil(totalComments / commentsPageSize),
    items: comments,
  })
}

export async function showPostAndCommentsOnPage(req: Request, res: Response) {
  await showPostAndComments(req, res)
}
