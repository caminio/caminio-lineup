/**
 * @class LineupController
 */


module.exports = function LineupController( caminio, policies, middleware ){

  'use strict';

  var carver        = require('carver');
  var xmlExporters  = require('../../lib/exporters/xml')( caminio );

  var Domain = caminio.models.Domain;

  return {

    _before: {
      '*!(export)': policies.ensureLogin
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
        try{
        carver()
          .set('cwd', res.locals.currentDomain.getContentPath()+'/lineup')
          .registerEngine('jade', require('jade'))
          .includeFileWriter()
          .set('locals', res.locals)
          .write()
          .then( function(){
            res.send(200); 
          })
          .catch(function(err){
            caminio.logger.error('carver error: ', err);
            if( err ){ res.json( 500, { error: err }); }
            res.send(200);
        });
        }catch(e){ console.log('catch',e); }
      } 
    ],

    'export': [
      getDomain,
      dispatchExport
    ]

  };

  function getDomain( req, res, next ){
    res.set('Content-Type', 'text/xml');
    Domain.findOne({ _id: req.param('id') }, function( err, domain ){
      if( err ){ res.send(500,err); }
      if( !domain ){ res.send(500,'domain not found'); }
      req.domain = domain;
      next();
    });
  }

  function dispatchExport( req, res ){
    var dialect = req.param('dialect') || 'ess';
    var result;
    
    if( dialect === 'dat' )
      result = xmlExporters.dat( req, res );

    result
      .then( function( entries ){
        console.log('we are ready');
        res.send( entries );
      })
      .catch( function(err){
        console.log('error', err);
        caminio.logger.error(err);
        res.send(err);
      });
  }

};
