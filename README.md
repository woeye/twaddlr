About
=====
Twaddlr is going to be a chat server inspired by Campfire or HipChat. It serves me as a learning project for node.js, 
MongoDB, Backbone.js and other modern technologies. Maybe you find the code helpful as well :)

Getting started
===============
At the moment Twaddlr uses MongoDB for storing both configurational and user data. It might be a good idea to 
introduce an abstraction layer later on. But for now I will concentrate on MongoDB.

Therefore make sure you have a MongoDB up and running. If you're on a Mac and using homebrew:

    brew install mongodb
    cd <where you want to store your data>
    mkdir -p data/twaddlr
    mongod --dbpath data/twaddlr
  
Next you need all required node.js module. From the root of your checked out twaddlr repository simply type:

    npm install
  
This should install all required packages.

Finally start the server with:

    node server.js
