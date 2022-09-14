* main things to think about when publishing your website are web security and performance
* At the bare minimum, you will want to remove the stack traces that are included on error pages during development, tidy up your logging, and set the appropriate headers to avoid many common security threats

**Set NODE_ENV to 'production'**
* We can remove stack traces in error pages by setting the NODE_ENV environment variable to production (it is set to 'development' by default)
* In addition to generating less-verbose error messages, setting the variable to production caches view templates and CSS files generated from CSS extensions
* Tests indicate that setting NODE_ENV to production can improve app performance by a factor of three
* This change can be made either by using export, an environment file, or the OS initialization system

**Log appropriately**
* Logging calls can have an impact on a high-traffic website
* In a production environment, you may need to log website activity (e.g. tracking traffic or logging API calls) but you should attempt to minimize the amount of logging added for debugging purposes
* One way to minimize "debug" logging in production is to use a module like debug that allows you to control what logging is performed by setting an environment variable
* You can then enable a particular set of logs by specifying them as a comma-separated list in the DEBUG environment variable
* wildcards are also supported
```js
#Windows
set DEBUG=author,book

#Linux
export DEBUG="author,book"
```
* Calls to debug can replace logging you might previously have done using console.log() or console.error()
* Replace any console.log() calls in your code with logging via the debug module
* Turn the logging on and off in your development environment by setting the DEBUG variable and observe the impact this has on logging
* If you need to log website activity you can use a logging library like Winston or Bunyan

**Use gzip/deflate compression for responses**
* Web servers can often compress the HTTP response sent back to a client, significantly reducing the time required for the client to get and load the page
* The compression method used will depend on the decompression methods the client says it supports in the request
* response will be sent uncompressed if no compression methods are supported
* Usr this to your site, compression middleware

**Use Helmet to protect against well known vulnerabilities**
* Helmet is a middleware package
* It can set appropriate HTTP headers that help protect your app from well-known web vulnerabilities

**Example: Installing LocalLibrary on Heroku**
*Why Heroku?*
* Heroku is one of the longest-running and popular cloud-based PaaS services
* It originally supported only Ruby apps, but now can be used to host apps from many programming environments, including Node (and hence Express)
* choosing to use Heroku for several reasons: 
  * Heroku has a free tier that is really free (albeit with some limitations)
  * As a PaaS, Heroku takes care of a lot of the web infrastructure for us
  * we don't have to worry about servers, load balancers, reverse proxies, restarting your website on a crash, or any of the other web infrastructure that Heroku provides
* While it does have limitations, they will not affect this particular application. For example:
  * Heroku's free-tier only provides short-lived storage, User-uploaded files are not safely stored on Heroku itself
  * free tier will sleep an inactive web app if there are no requests within a half-hour period, site may take several seconds to respond if the dyno is asleep
  * free tier limits your site to a certain amount of hours of runtime each month (time "asleep" is not used in the calculation, is fine for a low use or demonstration site but not suitable if 100% uptime is required
* Scaling your app on Heroku is very easy
* While Heroku is perfect for hosting this demonstration it may not be perfect for your real website
* Heroku makes things easy to set up and scale
* If you need more speed or uptime or add-on features, expect to pay for them

**How does Heroku work**
* Heroku runs websites within one or more "Dynos"
* Dunos are isolated, virtualized Unix containers that provide the environment required to run an application
* Dynos have an ephemeral file system (a short-lived file system that is cleaned and emptied each time the dyno restarts)
* One thing dynos share by default are the application configuration variables
* Internally, Heroku uses a load balancer to distribute web traffic to all "web" dynos
* Since nothing is shared between them, Heroku can scale an app horizontally by adding more dynos
* You may also need to scale your database to accept additional connections
* Because the file system is ephemeral you can't directly install services required by your application
* Databases, queues, caching systems, storage, email services, etc. are considered "add-ons."
* Heroku web applications use backing services provided by Heroku or 3rd parties
* Once attached to your web application, the add-on services are accessed in your web application via environment variables
* For each additional service, charges may apply
* In order to execute your application Heroku needs to be configured to set up the appropriate environment for your application's dependencies and be told how to start
* For Node apps, all the information it needs is obtained from your package.json file
* Developers interact with Heroku using a special client app/terminal, which is much like a Unix bash script
* This allows you to upload code stored in a git repository, inspect the running processes, see logs, set configuration variables, and much more
* To get our application on heroku, First we'll initialize a git repository for our Express web application
* Next, we'll make some minor changes to the package.json
* Once we've done that we'll set up a Heroku account, install the Heroku client on our local machine and use it to upload our application

**Creating an application repository in GitHub**
* Heroku is integrated with git, the source code version control system
* Heroku client you install will use git to synchronize changes you upload
* Heroku client creates a new "remote" repository named heroku
* It connects to a repository of your code on the Heroku cloud
* During development, you use git to store changes on your own repository
* When you want to deploy your site, you sync your changes to the Heroku repository

**Update the app for Heroku**
* This section explains the changes you'll need to make to our LocalLibrary application to get it to work on Heroku

*Set node version*
* package.json contains everything needed to work out your application dependencies and what file should be launched to start your site
* Heroku detects the presence of this file, and will use it to provision your app environment
* only useful information missing in our current package.json is the version of node
* We can find the version of node we're using for development by entering the command: `node --version`
* add this information as an engines > node section in json `"engines": {"node": "zz.xx.yy"}`

*Database configuration*
* So far in this tutorial, we've used a single database that is hard-coded into app.js
* Normally we'd like to be able to have a different database for production and development, so next we'll modify the LocalLibrary website to get the database URI from the OS environment (if it has been defined), and otherwise use our development database
* Open app.js and find the line that sets the MongoDB connection variable
* use process.env.MONGODB_URI to get the connection string from an environment variable named MONGODB_URI if has been set
* Before we proceed, let's test the site again and make sure it wasn't affected by any of our changes
* Get a Heroku account

**Install the client**
*Create and upload the website*
* To create the app we run the "create" command in the root directory of our repository `heroku create`
* This creates a git remote ("pointer to a remote repository") named heroku in our local git environment
* You can name the remote if you like by specifying a value after "create"
* If you don't then you'll get a random name, and will be used in the default URL
* We can then push our app to the Heroku repository such as this `git push heroku main`
* after that app should be now "running" on the site
* To open your browser and run the new website `heroku open`

**Setting configuration variables**
* You will recall from a preceding section that we need to set NODE_ENV to 'production' in order to improve our performance and generate less-verbose error messages
* We do this by entering the following command: 
```
heroku config:set NODE_ENV='production'
Setting NODE_ENV and restarting limitless-tor-18923... done, v13
NODE_ENV: production
```
* We should also use a separate database for production, setting its URI in the MONGODB_URI environment variable
* You can set up a new database and database-user exactly as we did originally, and get its devlopement URI
* You can set the URI as shown (obviously, using your own URI!)
```
heroku config:set MONGODB_URI=mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true
Setting MONGODB_URI and restarting limitless-tor-18923... done, v13
MONGODB_URI: mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true
```
* You can inspect your configuration variables at any time using the heroku config command `heroku config`
* Heroku will restart your app when it updates the variables
* If you check the home page now it should show zero values for your object counts, as the changes above mean that we're now using a new (empty) database

**Managing addons**
* Heroku uses independent add-ons to provide backing services to apps — for example, email or database services
* We don't use any addons in this website, but they are an important part of working with Heroku, so you may want to check out the topic Managing Add-ons (Heroku docs)

**Debugging**
* Heroku client provides a few tools for debugging:
```
heroku logs  # Show current logs
heroku logs --tail # Show current logs and keep updating with any new results
heroku ps   #Display dyno status
```
