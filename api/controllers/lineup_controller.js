/**
 * @class LineupController
 */


module.exports = function LineupController( caminio, policies, middleware ){

  'use strict';

  return {

    _before: {
      '*': policies.ensureLogin
    },

    /**
     * @method index
     */
    'index': [
      function( req, res ){
        res.caminio.render();
      }
    ],

    'compileAll':[
      function( req, res ){
        res.locals.models = caminio.models;
        res.locals.startWidth = req.param('start') || null;
        var Carver = require('carver');
        var compiler = Carver.init({
          workdir: res.locals.currentDomain.getContentPath()+'/lineup/index',
          locals: res.locals
        });

        compiler.compile( null, function( err ){
          if( err ){ res.json( 500, { error: err }); }
          res.send(200);
        });
      } 
    ]

  };

};
