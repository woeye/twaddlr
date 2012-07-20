## About
Twaddlr is going to be a chat server inspired by Campfire or HipChat. It serves me as a learning project for node.js, redis, backbone.js, bootstrap and other modern technologies. Maybe you find the code helpful as well :)

## Technology Stack
Twaddlr is currently build on 
 
 * node.js
 * sencha connect
 * jQuery 1.7 
 * underscore.js (required by backbone.js)
 * backbone.js
 * handlebars templating engine 
 * Twitter's bootstrap
 * RequireJS
 * WebSockets + einaros' ws on node's side
 * redis

## Getting started
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


## License
(The MIT License)

Copyright (c) 2012 Lars Hoss <lars.hoss@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
