# noisy byte

a test app for experimenting with observability instrumentation and performance engineering concepts. Made with react, node js express, redis, and sqlite3.

please note this app is not intended for production use and is purpose is soley as a learning tool.

link to blog article on this project (coming soon)


## local installation and dev setup

the application is based on a client-server architecture. The client is a react app and the server is a node js express app. The server uses sqlite3 as a database. Setup is relativley simple with the following steps.

```bash
# clone the repo
git clone https://github.com/mmaquer2/noisy-byte.git

# install dependencies
cd noisy-byte/app
npm install

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
cd server
node server.js

# start frontend
cd app
npm run start
```

## features

this app is a basic client-server with cache architecture that allows users to create, read, update, and delete data. 


## deployments

this app is not intended for production use. but to deploy the app to a cloud provider, you can use the following steps to run the docker images in the cloud service of your choosing.


using docker and docker-compose, you can build and run the app in a containerized environment. 
These have been tested on a local machine and on a digital ocean droplet.

```bash

wip

```

## experiments

wip (look at the experiments folder for more info)

### frameworks, libraries, and tools used in this project

- https://fakerjs.dev/  - generate fake data
- winston - logging
- opentelemetry - observability (tracing, metrics, logging)
- sqeuelize - ORM
- sqlite3 - database
- express - server
- react - client
- redis - cache
- auth - jwt 
- bycrpt - password hashing



### interesting project reads

- intro to redis and node js, https://www.digitalocean.com/community/tutorials/how-to-implement-caching-in-node-js-using-redis
- creating sane and custom node js express logs with winston, https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/