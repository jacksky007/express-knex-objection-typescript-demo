import fs from 'fs'
import { Knex } from 'knex'
import path from 'path'
import { promisify } from 'util'
import YAML from 'yaml'

const readFile = promisify(fs.readFile)

interface User {
  id: number
  name: string
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('posts').del()
  await knex('users').del()
  await knex('comments').del()

  // Inserts seed entries
  const [userId] = await knex('users').insert({ name: 'Proctor' })
  const postId = Math.round(Math.random() * 1000000000)
  await knex('posts').insert([
    {
      user_id: userId,
      id: postId,
      title: 'Demo Project Tasks',
      content: `<div id="instructions">
    <ol>
      <li>
        <h3>
          <div>Create sample data</div>
          <div>创建测试数据</div>
        </h3>
        <ul>
          <li>
            <div>Write a rake task to create 1,000 random users</div>
            <div class="zh">用 rake task 创建 1,000 个随机用户</div>
            <small>Load sample user names from <code>config/users.yml</code></small>
            <small class="zh">从 <code>config/users.yml</code> 文件中读取用户名</small>
          </li>
          <li>
            <div>Write a script create 10,000 comments for this post</div>
            <div class="zh">用 rake task 给这个帖子创建 10,000 个随机评论</div>
            <small>Load sample comment content from <code>config/comments.json</code></small>
            <small class="zh">从 <code>config/comments.json</code> 文件中读取评论内容</small>
          </li>
        </ul>
      </li>
      <li>
        <h3>
          <div>Display comments for this post</div>
          <div>显示用户评论</div>
        </h3>
        <ol>
          <li>
            <div>Display each comment\'s <code>user.name</code>, <code>comment.content</code> and <code>comment.created_at</code></div>
            <div class="zh">显示每个评论的 <code>user.name</code>, <code>comment.content</code> and <code>comment.created_at</code> 信息</div>
          </li>
          <li>
            <div>Add styling to match the looks of comments in our example video <i>(see full screen)</i></div>
            <div class="zh">给评论添加 CSS 样式，参照视频（可全屏查看）</div>
          </li>
          <li>
            <div>Add Ajax endless scrolling and loading (infinite scrolling)</div>
            <div class="zh">用 Ajax 实现无限下拉</div>
            <ul>
              <li>
                <div>Scrolling to the bottom of the page should trigger additional comments to load</div>
                <div class="zh">下拉到页面底部时，能够自动读取更多的评论</div>
              </li>
              <li>
                <div>You can assume no additional comments will be inserted or deleted during pagination</div>
                <div class="zh">可以忽略数据变化导致评论读取重复或遗漏的问题</div>
              </li>
              <li>
                <div>However, implementations that correctly handle comment additions and deletion during pagination will receive extra points</div>
                <div class="zh">如果你能把翻页过程中论数据变化带来的数据重复或遗漏问题解决，可以获得额外的分数</div>
              </li>
            </ul>
          </li>
          <li>
            <div>Show a loading indicator during the Ajax call</div>
            <div class="zh">Ajax 访问时显示 loading 状态</div>
          </li>
          <li>
            <div>Add pagination for the comments (pagesize = 100)</div>
            <div class="zh">给评论添加分页，每页设置 100 条记录</div>
            <ul>
              <li>
                <div>Use HTML5 API to update the Browser\'s url with the page number</div>
                <div class="zh">无限下拉时，用 HTML API 改变 url 把正确的页码更新到地址栏</div>
                <small><code>e.g: http://localhost:3000/posts/123/comments/p3</code></small>
                <small class="zh"><code>例如：http://localhost:3000/posts/123/comments/p3</code></small>
              </li>
            </ul>
          </li>
        </ol>
      </li>
      <li>
        <h3>
          <div>Evaluation criteria</div>
          <div>评判标准</div>
        </h3>
        <ol>
          <li>
            <div>Functionality and satisfying requirements</div>
            <div class="zh">准确地完成功能</div>
          </li>
          <li>
            <div>Code cleanliness and organization</div>
            <div class="zh">合理清晰的组织、编写代码</div>
          </li>
          <li>
            <div>Practical efficiency and running time</div>
            <div class="zh">良好的运行性能</div>
          </li>
        </ol>
      </li>
    </ol>
    <video width="480" controls autoplay>
      <source src="/demo.mov" type="video/mp4"/>
    </video>
  </div>`,
    },
  ])

  const users = await addUsers(knex)
  await addComments(knex, { users, postId })
}

async function addUsers(knex: Knex) {
  const content = await readFile(path.join(__dirname, '../samples/users.yml'), {
    encoding: 'utf-8',
  })
  const names = YAML.parse(content)
  const users: User[] = []

  // add 1000 random users
  for (let i = 0; i < 1000; i++) {
    const index = Math.round(Math.random() * (names.length - i))
    const name = names[index]
    // swap this user to the end of unused list
    ;[names[names.length - 1 - i], names[index]] = [
      names[index],
      names[names.length - 1 - i],
    ]

    const [id] = await knex('users').insert({ name })
    users.push({ id, name })
  }
  return users
}

async function addComments(
  knex: Knex,
  { users, postId }: { users: User[]; postId: number },
) {
  const content = await readFile(
    path.join(__dirname, '../samples/comments.json'),
    {
      encoding: 'utf-8',
    },
  )
  const comments: string[] = JSON.parse(content)

  // add 10,000 random comments
  for (let i = 0; i < 10000; i++) {
    const commentIndex = Math.floor(Math.random() * comments.length)
    const userIndex = Math.floor(Math.random() * users.length)
    await knex('comments').insert({
      content: comments[commentIndex],
      user_id: users[userIndex].id,
      post_id: postId,
    })
  }
}
