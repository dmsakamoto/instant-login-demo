# instant-login-demo

Demo app for supporting Clever's Instant Login. It demonstrates building an app
with some of the latest web app technology:

  - React
  - Webpack
  - Babel (i.e., ES2015, ES6)
  - Node/Express

The demo app is deployed on Heroku: [Demo App](https://obscure-castle-96108.herokuapp.com).

## Features

This demo app features Clever's Instant Login on a Node/Express server.
Clever's Instant Login is set up as global auth middleware.
Once a user is authorized they will have access to the API.

The front-end for this feature is built with React and Webpack using ES2015 syntax.
We do this to keep our app relevant in the ever-changing Javascript ecosystem.
Beyond React and ES2015 syntax, we also have `Hot Loading` set up for `development` environments.

## Install Instructions

* Requires Node v4.0+ ([Download](https://nodejs.org/en/) or `brew install node`) *

```shell
  npm install
  npm start
```
