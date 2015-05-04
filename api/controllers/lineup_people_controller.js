/**
 * @class LineupPeopleController
 */
module.exports = function LineupPeopleController( caminio, policies, middleware ){

  'use strict';

  var LineupEntry = caminio.models.LineupEntry;
  var async       = require('async');
  var join              = require('path').join;
  var fs                = require('fs');
  var carver            = require('carver');
  var _                 = require('lodash');
  var caminioCarver     = require('caminio-carver')(caminio, undefined, 'webpages');
  var snippetParser     = require('carver/plugins').snippetParser;
  var markdownCompiler  = require('carver/plugins').markdownCompiler;

  var LineupPeople   = caminio.models.LineupPerson;

  var superagent = require('superagent');

  var targetOrganizationId = "552b97136461761e43010000";
  var targetUserId = "552b97136461761e43000000";
  var api_key = '98af93326c4fef65cde9f57cf5d56f7f';

  var server = "www.ticketeer.at/api/v1/lineup_persons"

  return {

    _before: {
      '*': policies.ensureLogin,
      'update': updateLineupPerson,
      'create': createLineupPerson,
      'destroy': destroyLineupPerson
    },

    _beforeResponse: {
      'destroy': checkDependencies,
      'update': [ getWebpage, caminioCarver.after.save, compilePage ]
    },

    // _beforeRender: {
    //   '*': test
    // }

  };

  function createLineupPerson( req, res, next ){
    var person = req.body.lineup_person;
    superagent.agent()
    .post( server + "/" )
    .send({ 'lineup_person': person, 'api_key': api_key, 'locale': req.locale.split('-')[0]  })
    .end( function(err,res){
      req.body.lineup_person.updateID = JSON.parse( res.text).lineup_person.id;
      caminio.logger.debug('JUST CREATED: ', req.body.lineup_person );
      next();
    });
  }

  function updateLineupPerson( req, res, next ){
    LineupPeople.find({ '_id': req.params.id }).exec( function( err, persons){
      var cur_person = persons[0];
      superagent.agent()
      .put( server + "/" + cur_person.updateID )
      .send({ 'lineup_person': cur_person, 'api_key': api_key, 'locale': req.locale.split('-')[0]  })
      .end( function(err,res){
        if( res )
          caminio.logger.debug('JUST UPDATED: ', res.text);
        next();
      });
    });  
  }

  function destroyLineupPerson( req, res, next ){
    LineupPeople.find({ '_id': req.params.id }).exec( function( err, persons){
      var cur_person = persons[0];
      superagent.agent()
      .del( server + "/" + cur_person.updateID )
      .send({ 'api_key': api_key })
      .end( function(err,res){
        if( res )
          caminio.logger.debug('JUST DESTROYED: ', res.text);
        next();
      });
    });
  }




  function getWebpage( req, res, next ){
    caminio.models.Webpage.findOne({ filename: "team" })
    .exec( function( err, page ){
      req.webpage = page;
      next();
    });
  }

  function compilePage( req, res, next ){

    var lineupDir = join(res.locals.currentDomain.getContentPath(),'webpages');
    if( !fs.existsSync( lineupDir ) ){ 
      caminio.logger.debug('skipping carver, as', lineupDir, 'does not exist');
      return next();
    }

    caminio.models.Webpage.findOne({ filename: "team", camDomain: res.locals.currentDomain })
    .exec( function( err, page ){
      if( page ){
        carver()
        .set('cwd', join(res.locals.currentDomain.getContentPath(),'webpages'))
        .set('snippetKeyword', 'pebble')
        .set('langExtension', _.size(res.locals.domainSettings.availableLangs) > 0 )
        .set('publishingStatusKey', 'status')
        .includeAll()
        .registerEngine('jade', require('jade'))
        .registerHook('before.render',caminioCarver.setupLocals(req,res))
        .registerHook('after.write', caminioCarver.docDependencies)
        .registerHook('before.render', markdownCompiler)
        .registerHook('after.render', snippetParser )
        .set('doc', page)
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
      } else
        next();
    });
  }

  function checkDependencies( req, res, next ){
    LineupEntry.find({ 'lineup_jobs.lineup_person': req.lineup_person._id })
      .exec(function( err, entries ){
        async.eachSeries( entries, function(entry, nextEntry){
          var _ids = [];
          entry.lineup_jobs.forEach(function(job){
            if( job.lineup_person.toString() === req.lineup_person._id.toString() )
              _ids.push( job._id );
          });
          _ids.forEach(function(_id){
            entry.lineup_jobs.pull( _id );
          });
          entry.save( function( err ){
            if( err ){ caminio.logger.error('error when trying to save pulled-person entry', err); }
            nextEntry();
          });
        }, next );
      });

  }


};
