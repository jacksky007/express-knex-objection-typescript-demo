# Express.js + Knex.js + Objection.js + TypeScript Demo Project
This a demo project built using Express.js, Knex.js, Objection.js, Typescript.

## Project tech info
|||
|-|-|
|Server-side Framework|[Express.js](https://expressjs.com/)|
|Database connection|[Knex.js](https://knexjs.org/)|
|ORM|[Objection.js](https://vincit.github.io/objection.js/)|
|Node.js process manager|[PM2](https://pm2.keymetrics.io/)|
|Language|mostly in [Typescript](https://www.typescriptlang.org/)|
|Typescript transpiler|[Babel](https://babeljs.io/)|
|Template Engine|[Pug](https://pugjs.org/)|
|CSS preprocessor|[Stylus](https://stylus-lang.com/)|
|Task runner|[Gulp](https://gulpjs.com/)|
|Frontend bundler|[Webpack](https://webpack.js.org/)|
|Code Formatter|[Prettier](https://prettier.io/)|

# How to use
## Prerequisites
* Node.js >=14 installed
* Run `npm install` to install dependencies after enter the project directory
* To run the project without existing test data, delete `db/db.dev.sqlite3` and `db/db.prod.sqlite3` before starting the server

## Steps for development environment
1. run `npx knex --knexfile db/knexfile.ts migrate:latest` to generate databse file and tables
2. run `npx knex --knexfile db/knexfile.ts seed:run` to insert initial data in databse
3. run `npm run:dev` to both start dev server and watching tasks for frontend development
4. visit `http://localhost:3000/posts`, the it will be redirected to the first post page `http://localhost:3000/posts/{the id of first page}`

### Tips for development
* While in development enviroment, both changes of backend and frontend files will trigger corresponding task. So developer need not restart the backend server or frontend building task. Just refresh page after change any file either backend part or frontend part and the change will be seen.
* To start the development server in other port, run `PORT=xxx npm run dev:start-server` or modify `ecosystem.config.js` to add env settings for `DEV` app then start the development server.
* To check backend log, open a new terminal and run `pm2 log` to get it.
* To stop dev server, run `npm run dev:stop-server`.
* To stop frontend building task, press `CTRL + C` or ` CMD + C` in the terminal of the task to kill the watch task.

## Steps for production environment
1. run `NODE_ENV=production npx knex --knexfile db/knexfile.ts migrate:latest` to generate database file and tables
2. run `NODE_ENV=production npx knex --knexfile db/knexfile.ts seed:run` to insert initial data in database
3. run `npm run prod:build`, this will transpile backend Typescript files into JavaScript files then put them into `build` dir, and build frontend files into `build/public` dir
4. run `npm run prod:start-server` to start the server in production enviroment

### Tips for production envirement
* To stop server, run `npm run prod:stop-server`

## To be improved
* add tests
* add ESLint
* add logger
* output sourcemap for logging and debugging
* precompile pug files for backend in production enviroment to get better performance while rending views(Right now, some pug file are shared between in server side and browser side, and they are precompiled in browser side.)
* add hash to built files of frontend in production enviroment to get better control of cache in browsers
