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

  var superagent = require('superagent');

  var targetOrganizationId = "552b97136461761e43010000";
  var targetUserId = "552b97136461761e43000000";
  var api_key = '98af93326c4fef65cde9f57cf5d56f7f';

  var entry_server = "localhost:5000/api/v1/lineup_entries"
  var event_server = "localhost:5000/api/v1/lineup_events"

  return {

    _policies: {
      'events': policies.ensureLoginOrApiPublicOrToken,
      '*!(index,events,show,filter)': policies.ensureLogin,
      'show': policies.enableCrossOrigin
    },

    _before: {
      'create': createLineupEntry,
      'update': [ checkLocaleExistsAndDismiss, checkFestival, sortEvents, repairEmberLabels, updateLineupEntry ],
      'destroy': destroyLineupEntry
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
  
  function createLineupEntry( req, res, next ){
    var entry = req.body.lineup_entry;    
    superagent.agent()
    .post( entry_server + "/" )
    .send({ 'lineup_entry': prepareEntry(entry, req.locale.split('-')[0]), 'api_key': api_key, 'locale': req.locale.split('-')[0]  })
    .end( function(err,res){
      var entryUpdateID = JSON.parse( res.text).lineup_entry.id;
      req.body.lineup_entry.updateID =  entryUpdateID;
      caminio.logger.debug('JUST CREATED: ', req.body.lineup_entry );
      next();
    });
  }

  function updateLineupEntry( req, res, next ){
    LineupEntry.find({ '_id': req.params.id }).exec( function( err, entries){

      var entryUpdateID = entries[0].updateID || req.params.id;
      var entry = req.body.lineup_entry; 
      async.each( entry.lineup_events, updateLineupEvent, updateEntry );

      function updateEntry(){
        superagent.agent()
        .put( entry_server + "/" + entryUpdateID )
        .send({ 'lineup_entry': prepareEntry(entry, req.locale.split('-')[0]), 'api_key': api_key, 'locale': req.locale.split('-')[0]  })
        .end( function(err,res){
          if( res )
            caminio.logger.debug('JUST UPDATED: ', res.text);
          next();
        });
      }

      function updateLineupEvent( evt, nextEvt ){
        // var updateID = _.find( entries[0].lineup_events, { '_id': evt._id }, 'updateID' );
        var updateID = false;
        entries[0].lineup_events.forEach( function( curEvt ){
          if( evt._id == curEvt._id )
            updateID = curEvt.updateID;
        });
        if( updateID ){
          superagent.agent()
          .put( event_server + "/" + updateID )
          .send({ 
            'lineup_event': prepareEvent(evt), 
            'api_key': api_key, 
            'locale': req.locale.split('-')[0],
            'lineup_entry_id': entryUpdateID  
          })
          .end( function(err,res){
            if( res )
              caminio.logger.debug('JUST UPDATED: ', res.text);
            nextEvt();
          });
        }
        else{
          superagent.agent()
          .post( event_server + "/" )
          .send({ 
            'lineup_event': prepareEvent(evt), 
            'api_key': api_key, 
            'locale': req.locale.split('-')[0],
            'lineup_entry_id': entryUpdateID    
          })
          .end( function(err, res){
            evt.updateID = JSON.parse( res.text ).lineup_event.id;
            if( res )
              caminio.logger.debug('JUST UPDATED: ', evt );
            nextEvt();
          });
        }
      }

    });

  }

  function destroyLineupEntry( req, res, next ){
    LineupEntry.find({ '_id': req.params.id }).exec( function( err, entries){
      var entry = entries[0];
      superagent.agent()
      .del( entry_server + "/" + entry.updateID )
      .send({ 'api_key': api_key })
      .end( function(err,res){
        if( res )
          caminio.logger.debug('JUST DESTROYED: ', res.text);
        next();
      });
    });
  }


  function prepareEvent(e){
    var evt = e;
    evt.lineup_venue_id = evt.lineup_org;
    return evt;
  }


  function prepareEntry(e, locale){
    var first = true;
    var entry = e;

    entry.translations.forEach( function(t){
      if( t.locale === locale && first ){
        entry.title = t.title;
        entry.subtitle = t.subtitle;
        entry.description = t.content;
        first = false;
      }
    });
    entry.jobs = entry.lineup_jobs

    entry.created_at = entry.createdAt;
    entry.updated_at = entry.updatedAt;
    return entry;
  }


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
