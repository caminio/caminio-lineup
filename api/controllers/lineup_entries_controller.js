/**
 * @class LineupEntriesController
 */

module.exports = function LineupEntriesController( caminio, policies ){

  'use strict';

  var carver            = require('carver');
  var join              = require('path').join;
  var fs                = require('fs');
  var caminioCarver     = require('caminio-carver')(caminio, undefined, 'webpages');
  var snippetParser     = require('carver/plugins').snippetParser;
  var markdownCompiler  = require('carver/plugins').markdownCompiler;
  var _                 = require('lodash');
  var async             = require('async');
  var moment            = require('moment');

  var LineupEntry = caminio.models.LineupEntry;
  var Label       = caminio.models.Label;
  var Mediafile   = caminio.models.Mediafile;
  var Webpage     = caminio.models.Webpage;

  return {

    _policies: {
      'events': policies.ensureLoginOrApiPublicOrToken,
      '*!(index,events,show,filter)': policies.ensureLogin,
      'show': policies.enableCrossOrigin
    },

    _before: {
      'update': [ checkLocaleExistsAndDismiss, checkFestival, sortEvents, repairEmberLabels ]
    },

    _beforeResponse: {
      'update': [ compilePages, cleanupAttrs, compileKukuk ]
    },

    events: [
      collectEvents,
      function( req, res ){
        res.json( req.lineup_events );
      }],

    filter: [
      collectLabelsForFilter,
      collectByFilter,
      collectMediafiles,
      function( req, res ){
        res.json( req.lineup_entries );
      }]

  };

  function compileKukuk( req, res, next ){
    Webpage.findOne({ })
    .where({ camDomain: req.param('camDomain') || res.locals.currentDomain })
    .where({ filename: 'kukuk' })
    .exec(function( err, webpage ){
      if( webpage ){
        carver()
          .set('cwd', join(res.locals.currentDomain.getContentPath(),'webpages'))
          .set('template', 'kukuk')
          .set('snippetKeyword', 'pebble')
          .set('langExtension', _.size(res.locals.domainSettings.availableLangs) > 0 )
          .set('publishingStatusKey', 'status')
          .includeAll()
          .registerEngine('jade', require('jade'))
          .registerHook('before.render',caminioCarver.setupLocals(req,res))
          .registerHook('after.write', caminioCarver.docDependencies)
          .registerHook('before.render', markdownCompiler)
          .registerHook('after.render', snippetParser )
          .set('doc', webpage )
          .set('caminio', caminio)
          .set('debug', process.env.NODE_ENV === 'development' )
          .write()
          .then( function(){
            next();
          })
          .catch( function(err){
            console.log('carver caught', err.stack);
            next(err);
          });

      } else{
        next();
      }
    });
  }

  function collectEvents( req, res, next ){
    var q = LineupEntry.find({ camDomain: res.locals.currentDomain });
    if( req.param('bookable') )
      q.where({ 'lineup_events.quota': { $gte: 0 } });
    q.populate('lineup_events.lineup_org lineup_jobs.lineup_person');
    q.where({ 'lineup_events.bookable': true })
    .exec(function(err, entries){
      if( err ){ return res.json(500, { error: 'internal error', details: err }); }
      req.lineup_events = entries;
      next();
    });
  }

  function collectLabelsForFilter( req, res, next ){
    if( !req.param('label') )
      return next();
    var ciName = new RegExp(req.param('label'),'i');
    Label
      .find()
      .where({ camDomain: req.param('camDomain') || res.locals.currentDomain })
      .where({ name: ciName })
      .exec(function(err,labels){
        if( err ){ caminio.logger.error(err); return res.send(500,{ error: err }); }
        req.labels = labels;
        next();
      });
  }

  function collectMediafiles( req, res, next ){
    if( !req.lineup_entres )
      next();
    async.eachSeries( req.lineup_entries, function( entry, nextEntry ){
      Mediafile
        .find({ parent: entry._id, camDomain: req.param('camDomain') || res.locals.currentDomain })
        .exec( function( err, mediafiles ){
          if( err ){ caminio.logger.error(err); return res.send(500,{ error: err }); }
          entry.mediafiles = mediafiles;
          nextEntry();
        }, next);
    });
  }

  function collectByFilter( req, res, next ){
    var q = LineupEntry.find({ camDomain: req.param('camDomain') || res.locals.currentDomain, status: 'published' });
    if( req.labels )
      q.where({ labels: { $in: req.labels.map(function(label){ return label._id; }) }});
    if( !_.isEmpty(req.param('ends')) )
      q.where({ lineup_events: { $elemMatch: { starts: { $lt: moment(req.param('ends')).toDate() } } } });
    if( !_.isEmpty(req.param('location')) )
      q.where({ 'lineup_events.lineup_org': req.param('location') });
    q.exec(function(err,entries){
      if( err ){ caminio.logger.error(err); return res.send(500,{ error: err }); }
      var returnEntries = [];
      entries.forEach(function(entry){
        var isPast = false;
        if( !_.isEmpty( req.param('ends') ) )
          isPast = _.find( entry.lineup_events, function(evnt){
            return evnt.starts > moment(req.param('ends')).toDate();
          });
        if( !isPast )
          returnEntries.push( entry );
      });
      req.lineup_entries = returnEntries;
      next();
    });
  }

  function sortEvents( req, res, next ){
    var unsorted = req.body.lineup_entry.lineup_events;
    req.body.lineup_entry.lineup_events = unsorted.sort( function( a, b ){
      if( a.starts < b.starts )
        return -1;
      if( a.starts > b.starts )
        return 1;
      return 0;
    });
    next();
  }

  function compilePages( req, res, next ){
    var lineupDir = join(res.locals.currentDomain.getContentPath(),'lineup');
    if( !fs.existsSync( lineupDir ) ){ 
      caminio.logger.debug('skipping carver, as', lineupDir, 'does not exist');
      return next();
    }
    carver()
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
      .set('doc', req.lineup_entry)
      .set('caminio', caminio)
      .set('debug', process.env.NODE_ENV === 'development' )
      .write()
      .then( function(){
        next();
      })
      .catch( function(err){
        caminio.logger.error('carver caught', err.stack);
        next(err);
      });
  }

  function checkLocaleExistsAndDismiss( req, res, next ){

    var havingTranslations = [];
    if( req.body.lineup_entry.translations ){
      req.body.lineup_entry.translations.forEach(function(tr,index){
        if( havingTranslations.indexOf(tr.locale) >= 0 && !tr.id )
          req.body.lineup_entry.translations.splice(index,1);
        else
          havingTranslations.push( tr.locale );
      });
    }

    next();

  }

  function repairEmberLabels( req, res, next ){
    if( req.body.lineup_entry && req.body.lineup_entry.labels ){
      var repairedLabels = [];
      req.body.lineup_entry.labels.forEach(function(label){
        if( typeof(label) === 'object' )
          repairedLabels.push( label._id );
      });
      if( repairedLabels.length > 0 )
        req.body.lineup_entry.labels = repairedLabels;
    }
    next();
  }

  function checkFestival( req, res, next ){
    req.body.lineup_entry.lineup_events.forEach(function(evnt){
      if( !evnt.festival )
        evnt.festival = null;
      if( !evnt.lineup_org )
        return res.json(422, { error: { venue: 'missing venue'}});
    });
    next();
  }

  function cleanupAttrs( req, res, next ){
    if( req.lineup_entry.ensembles && typeof( _.first(req.lineup_entry.ensembles) ) === 'object' )
      req.lineup_entry.ensembles = req.lineup_entry.ensembles.map(function(ensemble){ return ensemble._id; });
    next();
  }


};
