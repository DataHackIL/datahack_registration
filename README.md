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
* Clone this repository
* Run `cd datahack_registration`
* Run `npm install` (via terminal)
* Create a file named `.env`
* Edit the file as such:
```bash
MONGO_DB_URI = <mongo connection string>
AWS_BUCKET_NAME = <aws bucket name>
# Ask for the keys from other staff members
```

* run `node server.js`
* Your local version of the website will be at `http://127.0.0.1:8080`
