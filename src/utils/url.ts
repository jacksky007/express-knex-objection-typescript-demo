// get the page url of post and comments on specific page
export function getPostCommentsPageUrl({
  postId,
  commentsPageId,
}: {
  postId: number
  commentsPageId: number
}) {
  return `/posts/${postId}/comments/p${commentsPageId}`
}

// build the API url getting post's comments on specific page
export function getPostCommentsApiUrl({
  postId,
  commentsPageId,
}: {
  postId: number
  commentsPageId: number
}) {
  return `${getPostCommentsPageUrl({ postId, commentsPageId })}.json`
}

// get postId & commentsPageId from url
export function parsePostCommentsPageUrl(url: string) {
  const matches = url.match(
    /posts\/(?<postId>[^\/]+)(?:\/(?:comments\/p(?<commentsPageId>[^\/]+)))?/,
  )
  const postId = Number(matches?.groups?.postId)
  const commentsPageId = Number(matches?.groups?.commentsPageId) || 1

  return {
    postId,
    commentsPageId,
  }
}
