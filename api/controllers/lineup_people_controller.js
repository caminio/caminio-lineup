/**
 * @class LineupPeopleController
 */
module.exports = function LineupPeopleController( caminio, policies, middleware ){

  'use strict';

  var LineupEntry = caminio.models.LineupEntry;
  var async       = require('async');

  return {

    _before: {
      '*': policies.ensureLogin
    },

    _beforeResponse: {
      'destroy': checkDependencies
    },

    _beforeRender: {
      '*': compilePage
    }

  };

  function compilePage( req, res, next ){
    next();
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
