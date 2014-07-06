/**
 * @class LineupEntriesController
 */

module.exports = function LineupEventsController( caminio, policies ){

  'use strict';

  var LineupEntry = caminio.models.LineupEntry;

  return {

    _policies: {
      '*': policies.ensureLogin
    },

    'show': function( req, res ){
      LineupEntry
        .findOne({ lineup_events: { $elemMatch: { _id: req.param('id') }}})
        .exec(function(err, entry){
          if( err ){
            caminio.logger.error('error trying to fetch lineup_event', err);
            return res.send(500,{ error: 'internal error', details: err });
          }
          if( !entry )
            return res.json(404, { error: 'not found' });
          res.json({
            lineup_entries: [ entry ],
            lineup_events: entry.lineup_events
          });
        });
    }

  };

};
