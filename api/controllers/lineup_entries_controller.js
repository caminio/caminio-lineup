/**
 * @class LineupEntriesController
 */
module.exports = function LineupEntriesController( caminio, policies, middleware ){

  return {

    _before: {
      '*': policies.ensureLogin,
      'create,update': repairTrIds 
    }

  };

  function repairTrIds( req, res, next ){
    if( req.body.lineup_entry && req.body.lineup_entry.translations && req.body.lineup_entry.translations.length > 0 )
      req.body.lineup_entry.translations.forEach(function(translation){
        if( '_id' in translation && translation._id === null )
          delete translation._id;
      });
    next();

  }

};