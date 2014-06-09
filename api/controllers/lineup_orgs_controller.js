/**
 * @class LineupOrgsController
 */
module.exports = function LineupOrgsController( caminio, policies, middleware ){

  'use strict';

  var LineupEntry       = caminio.models.LineupEntry;

  return {

    _before: {
      '*': policies.ensureLogin
    },

    _beforeResponse: {
      'destroy': checkDependencies
    }

  };

  function checkDependencies( req, res, next ){
    LineupEntry.update({ 'lineup_events.lineup_org': req.lineup_org._id }, { $pull: { 'lineup_events.lineup_org': req.lineup_org._id } }, function(err){
      console.log('here', arguments);
      next();
    });

  }

};
