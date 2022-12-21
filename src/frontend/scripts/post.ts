/**
 * post page's modules and components
 */

import type { Comment } from '../../models/comment'
import { formatDatetimeFromNow } from '../../utils/datetime'
import {
  getPostCommentsApiUrl,
  getPostCommentsPageUrl,
  parsePostCommentsPageUrl,
} from '../../utils/url'
import commentItemTpl from '../../views/posts/partials/comment-item.pug'
import commentsPaginationTpl from '../../views/posts/partials/comments-pagination.pug'

interface PostCommentsPagination {
  postId?: number
  pageSize: number
  pageId: number
  totalPages: number
}
type LoadMoreCommentsFn = ({
  commentsPageId,
}: {
  commentsPageId: number
}) => Promise<
  PostCommentsPagination & {
    items: Comment[]
  }
>

class CommentsComponent {
  container: Element
  commentsList: Element
  commentsPagination: Element

  postId: number
  commentsPageId: number

  hasMoreComments = true

  isLoading: boolean
  loadingIndicator: Element

  loadMoreComments: LoadMoreCommentsFn

  constructor({
    containerSelector,
    commentsPaginationSelector,
    commentsListSelector,
    postId,
    commentsPageId,
    loadMoreComments,
  }: {
    containerSelector: string
    commentsPaginationSelector: string
    commentsListSelector: string
    postId: number
    commentsPageId: number
    loadMoreComments: LoadMoreCommentsFn
  }) {
    const container = document.querySelector(containerSelector)

    if (!container) {
      throw new Error(
        `comments component element not found: ${containerSelector}`,
      )
    }
    this.container = container

    this.commentsList = container.querySelector(commentsListSelector)!
    this.commentsPagination = container.querySelector(
      commentsPaginationSelector,
    )!

    this.postId = postId
    this.commentsPageId = commentsPageId

    this.loadMoreComments = loadMoreComments

    this.isLoading = false
    this.loadingIndicator = document.createElement('div')
    this.loadingIndicator.classList.add('loading-indicator')
    this.loadingIndicator.innerHTML = '<i></i><i></i><i></i>'

    // if all necessary elements are present, listen to scroll event
    if (this.container && this.commentsList && this.commentsPagination) {
      this.addEventListeners()
    }
  }

  public destroy() {
    // TODO clean up
  }

  private addEventListeners() {
    // load more comments while scrolling down to the end of page
    window.addEventListener(
      'scroll',
      async () => {
        // TODO should event listener be removed?
        if (!this.hasMoreComments) {
          return
        }

        if (this.isLoading) {
          return
        }

        // whether scrolling to the end of comments list
        const clientRects = this.commentsList.getBoundingClientRect()
        if (clientRects.bottom > window.innerHeight) {
          return
        }

        // show loading indicator
        this.toggleLoading(true)

        // get comments for next page from server
        const moreComments = await this.loadMoreComments({
          commentsPageId: this.commentsPageId + 1,
        })

        // hide loading indicator
        this.toggleLoading(false)

        // no more comments
        if (moreComments.items.length === 0) {
          this.hasMoreComments = false
          this.commentsList.insertAdjacentHTML(
            'afterend',
            '<p class="empty">No more comments.</p>',
          )
          return
        }

        // update commentsPageId
        this.commentsPageId = moreComments.pageId

        // re-render comments pagination
        this.rerenderCommentsPagination({
          ...moreComments,
          postId: this.postId,
        })

        // append new comments
        this.commentsList.insertAdjacentHTML(
          'beforeend',
          moreComments.items
            .map((comment: Comment) =>
              commentItemTpl({ comment, formatDatetimeFromNow }),
            )
            .join(''),
        )

        // update url
        history.pushState(
          {},
          '',
          getPostCommentsPageUrl({
            postId: this.postId,
            commentsPageId: this.commentsPageId,
          }),
        )
      },
      { passive: true },
    )
  }

  // show or hide loading indicator
  private toggleLoading(isLoading: boolean) {
    this.isLoading = isLoading
    if (isLoading) {
      this.commentsList.insertAdjacentElement('afterend', this.loadingIndicator)
    } else {
      this.loadingIndicator.parentElement?.removeChild(this.loadingIndicator)
    }
  }

  private rerenderCommentsPagination(comments: PostCommentsPagination) {
    let tmp = document.createElement('div')
    tmp.innerHTML = commentsPaginationTpl({
      comments,
      getPostCommentsPageUrl,
    })
    this.commentsPagination.innerHTML = tmp.firstElementChild!.innerHTML
  }
}

// page app entry
function postPageApp() {
  // instantiate CommentsCompnent
  window.addEventListener('DOMContentLoaded', () => {
    // get postId and commentsPageId
    const url = new URL(window.location.href)
    const { postId, commentsPageId } = parsePostCommentsPageUrl(url.pathname)

    // init component
    new CommentsComponent({
      postId,
      containerSelector: '#posts-show .comments',
      commentsPaginationSelector: '.comments-pagination',
      commentsListSelector: '.comments-list',
      commentsPageId,
      loadMoreComments: async ({ commentsPageId }) => {
        const response = await fetch(
          getPostCommentsApiUrl({
            postId,
            commentsPageId,
          }),
        )
        const moreComments = await response.json()
        return moreComments
      },
    })
  })
}

postPageApp()
