/**
 * @class LineupController
 */

'use strict';

module.exports = function LineupController( caminio, policies, middleware ){

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
        var SiteGen = require('caminio-rocksol/generator')( caminio );

        var gen = new SiteGen( res.locals.currentDomain.getContentPath(), 'lineup' );

        gen.compileLayout( 'index', { locals: res.locals }, function( err, content ){
          res.send(200);
        });
      } 
    ]

  };

};