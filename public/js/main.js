// Configure require.js 

require.config({
  paths: {
    jquery: 'ext/jquery-1.8.2.min',
    underscore: 'ext/underscore-1.3.3.min',
    backbone: 'ext/backbone-0.9.2.min',
    async: 'ext/async.min',
    handlebars: 'ext/handlebars-1.0.rc.1',
    'jquery.cookie': 'ext/jquery.cookie',
    'engine.io': 'ext/engine.io',
    'jquery.animate': 'jquery.css3animate'
  },
  shim: {
    'jquery': {
      exports: '$'
    },
    'jquery.cookie': ['jquery'],
    'jquery.animate': ['jquery'],
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'handlebars': {
      exports: 'Handlebars'
    },
    'engine.io': {
      exports: 'eio'
    }
  }
});

require([
  'app/app'
], function(app) {
  app.start();
});

