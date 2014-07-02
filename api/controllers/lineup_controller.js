/**
 * @class LineupController
 */


module.exports = function LineupController( caminio, policies, middleware ){

  'use strict';

  var join              = require('path').join;
  var fs                = require('fs');
  var _                 = require('lodash');
  var RSVP              = require('rsvp');
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
      getFirstLast,
      function( req, res ){
        var lineupDir = join(res.locals.currentDomain.getContentPath(),'lineup');
        if( !fs.existsSync( lineupDir ) ){ 
          caminio.logger.debug('skipping carver, as', lineupDir, 'does not exist');
          return res.send(500,'skipping. lineupdir '+ lineupDir +' does not exist');
        }
        var locals = _.pick( res.locals, ['currentDomain','currentUser','firstMonth','lastMonth','curLang','firstEvent','lastEvent','env']);
        var compiler = carver()
          .set('cwd', lineupDir)
          // .set('template', 'spielplan')
          .set('langExtension', _.size(res.locals.domainSettings.availableLangs) > 0 )
          .set('snippetKeyword', 'pebble')
          .set('publishingStatusKey', 'status')
          .includeAll()
          .registerEngine('jade', require('jade'))
          .registerHook('before.render',caminioCarver.setupLocals(req,res))
          .registerHook('before.render', markdownCompiler)
          .registerHook('after.render', snippetParser )
          .set('caminio', caminio)
          .set('locals', locals)
          .set('debug', process.env.NODE_ENV === 'development' )
          // .set('destinations', [ 'file://'+join( res.locals.currentDomain.getContentPath(), 'public', 'spielplan')])
          // .set('dependencies', [{ template: 'stuecke', destinations: [ 'file://'+join(res.locals.currentDomain.getContentPath(), 'public', 'stuecke')]}])
          .write()
          .then( function(){
            res.send(200, req.lineupEntries.length+' compiled successfully.');
          })
          .catch( function(err){
            caminio.logger.error('carver caught', err.stack);
            if( err ){ return res.send(500,'ERROR:'+require('util').inspect(err)); }
          });
      } 
    ],

    'compileAllEntries':[
      getPublicLineupEntries,
      getFirstLast,
      compilePages,
      function(req,res){
        res.send(200,req.lineupEntries.length+' entries successfully processed');
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

  function getFirstLast( req, res, next ){
    LineupEntry.findOne({ camDomain: res.locals.currentDomain, status: 'published', lineup_events: { $not: { $size: 0}}}).sort({ 'lineup_events.starts': -1 }).exec(function(err, entry){
      res.locals.lastEvent = res.locals.lastMonth = _.last(_.sortBy( entry.lineup_events, 'starts')).starts;
      LineupEntry.findOne({ camDomain: res.locals.currentDomain, status: 'published', lineup_events: { $not: { $size: 0}}}).sort({ 'lineup_events.starts': 1 }).exec(function(err, entry){
        res.locals.firstEvent = res.locals.firstMonth = _.first(_.sortBy( entry.lineup_events, 'starts')).starts;
        next();
      });
    });
  }

  function compilePages( req, res, next ){
 
    var prom = new RSVP.Promise(function(resolve){ resolve(); });
    req.lineupEntries.forEach(function(entry){
      prom = prom.then( function(){ return processEntry(entry); });
    });

    prom.then(function(){
      next();
    });

    function processEntry(entry){
      var lineupDir = join(res.locals.currentDomain.getContentPath(),'lineup');
      if( !fs.existsSync( lineupDir ) ){ 
        caminio.logger.debug('skipping carver, as', lineupDir, 'does not exist');
        return next();
      }
      return carver()
        .set('cwd', lineupDir)
        .set('locals',_.pick( res.locals, ['currentDomain','currentUser','firstMonth','lastMonth','curLang','firstEvent','lastEvent','env']))
        .set('skipDependencies',true)
        .set('template', 'show')
        .set('langExtension', _.size(res.locals.domainSettings.availableLangs) > 0 )
        .set('snippetKeyword', 'pebble')
        .set('publishingStatusKey', 'status')
        .includeAll()
        .registerEngine('jade', require('jade'))
        .registerHook('before.render',caminioCarver.setupLocals(req,res))
        .registerHook('before.render', markdownCompiler)
        .registerHook('after.render', snippetParser )
        .set('doc', entry)
        .set('caminio', caminio)
        .set('debug', process.env.NODE_ENV === 'development' )
        .write();
    }

  }

};
