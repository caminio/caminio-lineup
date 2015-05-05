/**
 * @class LineupOrgsController
 */
module.exports = function LineupOrgsController( caminio, policies, middleware ){

  'use strict';

  var LineupEntry = caminio.models.LineupEntry;
  var LineupOrg   = caminio.models.LineupOrg;
  var async       = require('async');

  var superagent = require('superagent');

  var targetOrganizationId = "552b97136461761e43010000";
  var targetUserId = "552b97136461761e43000000";
  var api_key = '98af93326c4fef65cde9f57cf5d56f7f';

  var server = "www.ticketeer.at/api/v1/lineup_venues";

  return {

    _before: {
      '*!(index)': policies.ensureLogin,
      'update': updateLineupVenue,
      'create': createLineupVenue,
      'destroy': destroyLineupVenue
    },

    _beforeResponse: {
      'destroy': checkDependencies
    }

  };



  function createLineupVenue( req, res, next ){
    var org = req.body.lineup_org;
    if( org.type === 'venue' ){
      var venue = prepareVenue( org, req.locale.split('-')[0] );
      superagent.agent()
      .post( server + "/" )
      .send({ 'lineup_venue': venue, 'api_key': api_key, 'locale': req.locale.split('-')[0]  })
      .end( function(err,res){        
        if ( res.statusCode < 300 ){
          var res_venue = JSON.parse( res.text).lineup_venue;
          if ( res_venue ){
            req.body.lineup_org.updateID =  res_venue.id;
            caminio.logger.debug('JUST CREATED: ', req.body.lineup_org );
        } }
        next();
      });
    }  
  }

  function updateLineupVenue( req, res, next ){
    LineupOrg.find({ '_id': req.params.id }).exec( function( err, orgs){
      var cur_org = orgs[0];
      var org = req.body.lineup_org;
      if( org.type === 'venue' ){
        var venue = prepareVenue( org, req.locale.split('-')[0] );
        superagent.agent()
        .put( server + "/" + cur_org.updateID )
        .send({ 'lineup_venue': venue, 'api_key': api_key, 'locale': req.locale.split('-')[0]  })
        .end( function(err,res){
          if( res )
            caminio.logger.debug('JUST UPDATED: ', res.text);
          next();
        });
      } 
    });  
  }

  function destroyLineupVenue( req, res, next ){
    LineupOrg.find({ '_id': req.params.id }).exec( function( err, orgs){
      var org = orgs[0];
      if( org && org.type === 'venue' ){
        superagent.agent()
        .del( server + "/" + org.updateID )
        .send({ 'api_key': api_key })
        .end( function(err,res){
          if( res )
            caminio.logger.debug('JUST DESTROYED: ', res.text);
          next();
        });
      } else
        next();  
    });
  }


  function checkDependencies( req, res, next ){
    LineupEntry.find({ 'lineup_events.lineup_org': req.lineup_org._id })
      .exec(function( err, entries ){
        async.eachSeries( entries, function(entry, nextEntry){
          var _ids = [];
          entry.lineup_events.forEach(function(evnt){
            if( evnt.lineup_org.toString() === req.lineup_org._id.toString() )
              _ids.push( evnt._id );
          });
          _ids.forEach(function(_id){
            entry.lineup_events.pull( _id );
          });
          entry.save( function( err ){
            if( err ){ caminio.logger.error('error when trying to save pulled-org entry', err); }
            nextEntry();
          });
        }, next );
      });

  }


  function prepareVenue(v, locale){
    var venue = v;
    var first = true;

    venue.seats = -1;
    venue._type = "LineupVenue";
    venue.translations.forEach( function(t){
      if( t.locale === locale && first ){
        venue.title = t.title;
        venue.description = t.content;
        first = false;
      }
    });
  
    venue.country_code = venue.country;
    venue.orig_url = venue.orig_url;
    venue.ext_ref_id = venue.extRefId;
    venue.ext_ref_src = venue.extRefSrc;
    venue.ext_ref_note = venue.extRefNote;
    venue.ext_ref_sync_at = venue.extRefSyncAt;
    venue.ext_url = venue.extUrl;
    venue.reach_by_bus = venue.reachByBus;
    venue.reach_by_tram = venue.reachByTram;
    venue.reach_by_train = venue.reachByTrain;
    venue.video_url = venue.videoUrl;
    venue.video_url_type = venue.video_url_type;

    // delete venue.orig_url;
    // delete venue.translations;
    // delete venue.filename;
    // delete venue.createdAt;
    // delete venue.updatedAt;
    // delete venue.createdBy;
    // delete venue.updatedBy;
    // delete venue.camDomain;
    // delete venue.members;
    // delete venue.type;
    // delete venue.country;
    return venue;
  }

};
