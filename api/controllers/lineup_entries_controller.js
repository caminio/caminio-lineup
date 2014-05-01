/**
 * @class LineupEntriesController
 */
module.exports = function LineupEntriesController( caminio, policies, middleware ){

  var SiteGen        = require('caminio-rocksol/generator')( caminio );

  var LineupEntry = caminio.models.LineupEntry;

  return {

    _before: {
      '*': policies.ensureLogin,
      'update': checkLocaleExistsAndDismiss
    },

    _beforeResponse: {
      'update': compilePages
    },

  };

  function compilePages( req, res, next ){
    gen = new SiteGen( res.locals.currentDomain.getContentPath(), 'projects' );
    gen.compileObject( 
            req.lineup_entry,
            { locals: res.locals,
              layout: {
                name: 'projects'
              },
              isPublished: (req.lineup_entry.status === 'published') },
            next);
  }

  
  function checkLocaleExistsAndDismiss( req, res, next ){

    var havingTranslations = [];
    if( req.body.lineup_entry.translations ){
      req.body.lineup_entry.translations.forEach(function(tr,index){
        if( havingTranslations.indexOf(tr.locale) >= 0 && !tr.id )
          req.body.lineup_entry.translations.splice(index,1);
        else
          havingTranslations.push( tr.locale );
      });
    }

    next();

  }

};