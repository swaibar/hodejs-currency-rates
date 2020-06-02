#currency one page app

##features

* Check current rate of every given currency against any other currency of the user’s choice
* Visualise the historical change in rate between any two dates of the user’s choice, against any currency of the user’s choice
* Calculate retrospective purchasing outcomes, for example: If I had purchased £200 worth of CAD in September 2008, how much CAD would I have today?

##usage

    git clone
    node index.js

visit [localhost:3000/currencies](http://localhost:3000/currencies) to use the application

Alternatively `currency-one-page-app.html` could be deployed standalone.

##development

###technology

* Node.js, angular and Bootstrap. 
* https://exchangeratesapi.io/ (Foreign Exchange Rates API, as requested)
* CDN usage to create the simplest possible solution

###progress

 * Initially this Node.js code was committed to provide a module free handler for our application
 * Started with a file reader to store the users preference and then realised this would need authentication
 * After this commit I started to look at users and authentication, then as this is "needed" I moved on to look at templating
 * While looking at templating I decided to use angular and keep this as pure JavaScript as possible and as I've already made it clear I can use the package manager... maybe I can complete without?
 * Templating and users were not needed so I returned to focus on the main requirements and started to use angular in a single test html to develop this
 * Despite focus not on presentation I like to use an application that looks appealing so I added basic bootstrap, flags, currency symbol and basic table styling
 * If I had purchased £200 worth of CAD in September 2008, how much CAD would I have today?
 * noticed that I'd only done the calculation at load time, added call so that any param changed updates the value
 * Noticed limitations of the API, would suggest using a different one that client request (no rates before 2000 start of ECB/EUR?; cannot get rates certain rate dates; AFAIK ECB updates the rates daily)
 * linked `currency-one-page-app.html` to the simple Node.js server/router
 * many smaller refactors and comments - added this readme.md instead of a comment in index.js

###todo

 * improve graph: series colours; title; better axis;
 * add currency and country names, not just codes
 * add a select for base currency at the top of the page
 * order currencies alphbetically
 * add another retrospective purchasing outcome, if I brought that amount every month since that date
 * add another graph for the above retrospective purchasing outcome
 * how much would GBP 226 have purchased in CAD if purchased in September 2008
 * User authentication (sign up, manage profile, login, logout, etc) to store their base currency - requires routing and auth