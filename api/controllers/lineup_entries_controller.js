/**
 * @class LineupEntriesController
 */

var join          = require('path').join;
var fs            = require('fs');
var async         = require('async');

module.exports = function LineupEntriesController( caminio, policies, middleware ){

  var SiteGen        = require('caminio-rocksol/generator')( caminio );

  var LineupEntry = caminio.models.LineupEntry;

  return {

    _before: {
      '*': policies.ensureLogin,
      'update': [ checkLocaleExistsAndDismiss, repairEmberLabels ]
    },

    _beforeResponse: {
      'update': compilePages
    },

  };

  function compilePages( req, res, next ){
    var settingsFile = join( res.locals.currentDomain.contentPath, 'projects', '.settings' );
    var types = {'LineupEntry': { layout: { name: 'projects' } }};

    if( fs.existsSync( settingsFile+'.js' ) ){
      var settingsContent = require( settingsFile );
      if( settingsContent.compileDeps )
        types = settingsContent.compileDeps;
    }

    async.eachSeries( Object.keys(types), function( type, nextType ){

      var gen = new SiteGen( res.locals.currentDomain.getContentPath(), types[type].namespace );

      var q = caminio.models[type].find();
      if( types[type].conditions && typeof(types[type].conditions) === 'object' ){
        var conditions = {};
        for( var key in types[type].conditions )
          conditions[key] = ( types[type].conditions._id && types[type].conditions._id === 'PARAM_ID' ) ?
                              req.param('id') :
                              types[type].conditions[key];
        q.where(conditions);
      }
      
      q.exec( function( err, docs ){
        async.eachSeries( docs, function( doc, compileNext ){

          gen.compileObject( 
              doc,
              { locals: res.locals,
                layout: types[type].layout,
                isPublished: (req.doc.status === 'published') },
              compileNext );

        }, nextType );
      });
    }, next );

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

  function repairEmberLabels( req, res, next ){
    if( req.body.lineup_entry && req.body.lineup_entry.labels ){
      repairedLabels = [];
      req.body.lineup_entry.labels.forEach(function(label){
        if( typeof(label) === 'object' )
          repairedLabels.push( label._id );
      });
      if( repairedLabels.length > 0 )
        req.body.lineup_entry.labels = repairedLabels;
    }
    next();
  }


};
