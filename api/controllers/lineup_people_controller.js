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

  return {

    _before: {
      '*': policies.ensureLogin
    },

    _beforeResponse: {
      'destroy': checkDependencies,
      'update': [ getWebpage, caminioCarver.after.save, compilePage ]
    },

    // _beforeRender: {
    //   '*': test
    // }

  };

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

    caminio.models.Webpage.findOne({ filename: "team" })
    .exec( function( err, page ){

      console.log( page, '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );

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
