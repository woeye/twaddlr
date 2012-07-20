// Configure require.js 

require.config({
  paths: {
    jquery: 'libs/jquery/jquery-1.7.2.min',
    underscore: 'libs/underscore/underscore-1.3.3.min',
    backbone: 'libs/backbone/backbone-0.9.2.min',
    async: 'libs/async/async-0.1.22.min',
    handlebars: 'libs/handlebars/handlebars-1.0.0.beta.6',
    'jquery.cookie': 'libs/jquery.cookie/jquery.cookie',
    'jquery.animate': 'libs/jquery.css3animate/jquery.css3animate'
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
    }
  }
});

require([
  'app/app'
], function(app) {
  app.start();
});

