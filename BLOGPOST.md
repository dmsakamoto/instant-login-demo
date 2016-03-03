# Supporting Clever Instant Login

Clever uses OAuth 2.0 to support its Instant Login. OAuth 2.0 is a little tricky
to set up and there are not many public strategies in the JavaScript and Node
communities showing how to set this up from scratch with Clever. However, it is
important to know that there are several, trusted, public packages on `npm` that
support OAuth 2.0. For this demo though, we will set up the workflow from scratch.

For this demo, we will build a simple React app served from a Node/Express server.
We will use all ES2015 on the client app and the ES2015 features supported by
Node 4.* (i.e., new syntax but CommonJS modules). In addition, we will use Webpack
as our build system and demo hot-loading. While this app will be written in React,
it will not immediately be a single-page app because our goal is to demonstrate
a traditional OAuth 2.0 workflow. Rather these technical choices make this app
extensible to be a modern single-page app.

At the end of this demo, we will build a simple app where a user can go to your site,
login, and then be redirected to the core of your app (we will use the `/me` endpoint).

## Register as a Developer with Clever and Configure App

Clever provides a lot of great documentation. Navigating this documentation really
depends on a developer's background. In our scenario, the developer knows how to
build their React/Node/Express web app, but they do not know how to integrate it with
Clever using OAuth 2.0. So our steps will navigate through Clever's documentation
accordingly.

### Set up and deploy an app

Clever's registration process and documentation assumes that the developer knows
how to build and deploy their app, and an App URL is required information for the
registration process. If you do not already have an app or just want to set up a
sandbox environment to test Clever's Instant Login, my solution was to create a
GitHub repo, set up a [simple Express server](http://expressjs.com/en/starter/hello-world.html), and deploy this server on [Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction).

### Register with Clever

Follow the on-screen instructions to finish the registration process.
Be sure to include the URL for the app that you are connecting to Clever
(i.e., the Heroku sandbox). Once you completed registration, Clever will assign
the app a Client ID and Client Secret.
[Insert Image]()

These will be important to write down and save. For local development, save them to a configuration file and remember to include that file in your `.gitignore`. Also, set
the configuration variables in your deployment environment. On
the [Heroku Dashboard](https://dashboard.heroku.com/apps), this is in your app
`Settings > Config Variables`. When you set these config variables, be sure to include
the configuration variables in your server configuration (more details in the next step).

### Set up Redirect/Callback URI

The final step of registering your app is to configure some Redirect URLs on
your [application dashboard](https://apps.clever.com/partner/applications). Clever
documents this process on [Implementing Clever SSO](https://dev.clever.com/instant-login/implementation).

So in the Redirect URLs we will need to add two URLs:
```
  https://your.app.url/oauth/callback
  http://localhost:PORT/oauth/callback
```

My demo app looks like this:


While this step is really simple, it does require some foresight into your app.
The Redirect URLs will be where Clever will send the `code` and `access token` for
for your app to interact with the API. Clever has an [OAuth 2.0 diagram](https://dev.clever.com/instant-login/bearer-tokens) that shows this workflow.

Our user will go to our root route `/` and then login with a request to go to `/me`. If our session does not have the user, we will redirect to `/oauth` middleware, which will make a request to Clever to authenticate the user. Clever will respond with either a `code` or an `access token` to the Redirect URL `/oauth/callback`. Once the necessary communication happens, the user will be saved in the session, and can proceed to the
`/me` route.

## Configure the server





## Set up routing

User goes to root -> Logs in (redirect to oauth) -> opens app ('/me')

If user goes anywhere else, redirect to root

## Build workflow
