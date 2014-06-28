/**
 * @class LineupController
 */


module.exports = function LineupController( caminio, policies, middleware ){

  'use strict';

  var join              = require('path').join;
  var fs                = require('fs');
  var _                 = require('lodash');
  var async             = require('async');
  var carver            = require('carver');
  var caminioCarver     = require('caminio-carver')(caminio, undefined, 'webpages');
  var snippetParser     = require('carver/plugins').snippetParser;
  var markdownCompiler  = require('carver/plugins').markdownCompiler;

  var LineupEntry = caminio.models.LineupEntry;

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
      getPublicLineupEntries,
      function( req, res ){
        var lineupDir = join(res.locals.currentDomain.getContentPath(),'lineup');
        if( !fs.existsSync( lineupDir ) ){ 
          caminio.logger.debug('skipping carver, as', lineupDir, 'does not exist');
          return next();
        }
        var compiler = carver()
          .set('cwd', lineupDir)
          .set('template', 'show')
          .set('langExtension', _.size(res.locals.domainSettings.availableLangs) > 0 )
          .set('snippetKeyword', 'pebble')
          .set('publishingStatusKey', 'status')
          .includeAll()
          .registerEngine('jade', require('jade'))
          .registerHook('before.render',caminioCarver.setupLocals(req,res))
          .registerHook('before.render', markdownCompiler)
          .registerHook('after.render', snippetParser )
          .set('caminio', caminio)
          .set('debug', process.env.NODE_ENV === 'development' );
        async.eachSeries( req.lineupEntries, function(lineupEntry, nextEntry){
          compiler
            .set('doc', lineupEntry)
            .write()
            .then( function(){
              nextEntry();
            })
            .catch( function(err){
              console.log('carver caught', err.stack);
              if( err ){ return res.send(500,"ERROR:"+require('util').inspect(err)); }
            });
        }, function(){
          res.send(200, req.lineupEntries.length+' compiled successfully.')
        });
      } 
    ],

    'export': [
      getDomain,
      dispatchExport
    ]

  };

  function getPublicLineupEntries( req, res, next ){
    LineupEntry
      .find()
      .where({ camDomain: res.locals.currentDomain })
      .exec(function(err,entries){
        if( err ){ return res.send(500,"ERROR:"+require('util').inspect(err)); }
        req.lineupEntries = entries;
        next();
      });
  }

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
        res.send( entries );
      })
      .catch( function(err){
        console.log('error', err, err.stack);
        caminio.logger.error(err);
        res.send(err);
      });
  }

};
