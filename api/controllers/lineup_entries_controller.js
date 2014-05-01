/**
 * @class LineupEntriesController
 */
module.exports = function LineupEntriesController( caminio, policies, middleware ){

  var SiteGen = require('caminio-rocksol/generator');

  var LineupEntry = caminio.models.LineupEntry;

  return {

    _before: {
      '*': policies.ensureLogin
    },

    _beforeResponse: {
      'update': compilePages
    },

  };

  function compilePages( req, res, next ){
    gen = new SiteGen( caminio, res.locals.currentDomain.getContentPath(), 'projects' );
    console.log( req.lineup_entry );
    gen.compileObject( 
            req.lineup_entry,
            { locals: res.locals,
              layout: {
                name: 'projects'
              },
              isPublished: (req.lineup_entry.status === 'published') },
            next);
  }

};