### noisy byte

a test app for experimenting with observability instrumentation and performance engineering concepts. Made with react, node js express, redis, and sqlite3.

please note this app is not intended for production use and is purpose is soley as a learning tool.


## local installation and dev setup

the application is based on a client-server architecture. The client is a react app and the server is a node js express app. The server uses sqlite3 as a database. Setup is relativley simple with the following steps.

```bash
# clone the repo
git clone <project_github_fqdn>

# install dependencies
cd noisy-byte/app
cd noisy-byte/server

npm install

## start the redis service 

# for mac users
brew install redis # Install Redis
brew services start redis # Start Redis

# for linux users
sudo apt-get install redis-server
sudo systemctl start redis-server

# start backend and database
node server/server.js

# start frontend
npm start
```

## features

this app is a basic client-server with cache architecture that allows users to create, read, update, and delete data. 
- notes on observability and performance engineering experiments to try


## Experiments
wip (look at the experiments folder for more info)

### frameworks, libraries, and tools used in this project

- https://fakerjs.dev/  - generate fake data
- sqeuelize - ORM
- sqlite3 - database
- express - server
- react - client
- redis - cache


### recommended reading
- intro to redis and node js, https://www.digitalocean.com/community/tutorials/how-to-implement-caching-in-node-js-using-redis