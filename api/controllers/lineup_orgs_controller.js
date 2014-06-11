/**
 * @class LineupOrgsController
 */
module.exports = function LineupOrgsController( caminio, policies, middleware ){

  'use strict';

  var LineupEntry       = caminio.models.LineupEntry;
  var async       = require('async');

  return {

    _before: {
      '*': policies.ensureLogin
    },

    _beforeResponse: {
      'destroy': checkDependencies
    }

  };

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

};
