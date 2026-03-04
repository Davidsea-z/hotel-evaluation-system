module.exports = {
  apps: [
    {
      name: 'hotel-evaluation-frontend',
      script: 'npx',
      args: 'wrangler pages dev . --ip 0.0.0.0 --port 3000',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    },
    {
      name: 'hotel-evaluation-backend',
      script: 'python3',
      args: 'app.py',
      cwd: '/home/user/webapp/backend',
      env: {
        FLASK_ENV: 'development',
        FLASK_APP: 'app.py'
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      interpreter: 'none'
    }
  ]
}
