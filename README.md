About
=====
Twaddlr is going to be a chat server inspired by Campfire or HipChat. It serves me as a learning project for node.js, redis, backbone.js, bootstrap and other modern technologies. Maybe you find the code helpful as well :)

Technology Stack
================
Twaddlr is currently build on 
 
 * node.js
 * sencha connect
 * jQuery 1.7 
 * underscore.js (required by backbone.js)
 * backbone.js
 * handlebars templating engine 
 * Twitter's bootstrap
 * SockJS
 * redis

Getting started
===============
At the moment Twaddlr uses redis for storing both configurational and user data. It might be a good idea to 
introduce an abstraction layer later on. But for now I will concentrate on redis.

Therefore make sure you have a redis up and running. If you're on a Mac and using homebrew:

    brew install redis
    redis-server
  
Next you need all required node.js module. From the root of your checked out twaddlr repository simply type:

    npm install
  
This should install all required packages.

Finally start the server with:

    node server.js
