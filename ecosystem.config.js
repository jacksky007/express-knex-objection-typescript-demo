module.exports = {
  apps: [
    {
      name: 'DEV',
      exec_mode: 'cluster',
      script: './src/app.ts',
      watch: ['src'],
      ignore_watch: ["'src/frontend"],
      interpreter: './node_modules/.bin/ts-node',
      // interpreter_args: "-P ./tsconfig.json -r ts-node/register"
    },
    {
      name: 'PROD',
      exec_mode: 'cluster',
      script: './build/app.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
  ],
}
