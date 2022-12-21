import { default as express, Application } from 'express'
import path from 'path'

import { postsRouter } from './routes/posts'

const app: Application = express()

// use pug template
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// serve static files in public dir
app.use(express.static(path.join(__dirname, 'public')))

// main routes
app.use('/posts/', postsRouter)

// default route
app.get('/', (req, res) => {
  res.send('Hello World! This the default route "/".')
})

// run the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server started listening on port ${port}!`)
})
