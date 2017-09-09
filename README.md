# DataHack's Registration system.

A registration system for hackathons, supporting user and team registration.
Technologies: NodeJS, MongoDB, Passport.


## Features & Architecture
1) Written in nodeJS, together with some simple EJs templating. All data is stored in MongoDB.
2) The whole site (including the static site) is served via the NodeJS server.
3) Using AWS EC2 free tier works great for small hackathons.
4) We used mLab.com for mongoDB instance. They have a basic sandbox 500MB plan which is free. Worked fine.

## Bootstraping
In order to bootstrap, you should first:
* insert mongodb connection string in config/env/development.js
* npm install (via terminal, should cd to main folder before)
* node server.js (via terminal, should cd to main folder before)
* chrome -> localhost
