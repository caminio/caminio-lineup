/**
 * @class LineupEntriesController
 */
module.exports = function LineupEntriesController( caminio, policies, middleware ){

  var SiteGen        = require('caminio-rocksol/site_gen')( caminio );

  var LineupEntry = caminio.models.LineupEntry;

  return {

    _before: {
      '*': policies.ensureLogin
    },

    _beforeResponse: {
      'update': compilePages
    },

  }

  function compilePages( req, res, next ){
    // TODO;
    next();
  }

};