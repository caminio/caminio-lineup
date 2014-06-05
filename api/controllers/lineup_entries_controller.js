/**
 * @class LineupEntriesController
 */

module.exports = function LineupEntriesController( caminio, policies, middleware ){

  'use strict';

  //var SiteGen       = require('caminio-rocksol/generator')( caminio );
  var Carver        = require('carver');

  var LineupEntry = caminio.models.LineupEntry;

  return {

    _policies: {
      'events': policies.ensureLoginOrApiOrToken,
      '*!(events)': policies.ensureLogin,
    },

    _before: {
      'update': [ checkLocaleExistsAndDismiss, repairEmberLabels ]
    },

    _beforeResponse: {
      //'update': compilePages
      //'update': compileWithCarver
    },

    events: [
      collectEvents,
      function( req, res ){
        res.json( req.lineup_events );
      }]

  };

  function collectEvents( req, res, next ){
    var q = LineupEntry.find({ camDomain: res.locals.currentDomain });
    if( req.param('bookable') )
      q.where({ 'lineup_events.quota': { $gte: 0 } });
    q.where({ 'lineup_events.bookable': true })
    .exec(function(err, entries){
      if( err ){ return res.json(500, { error: 'internal error', details: err }); }
      req.lineup_events = entries;
      next();
    });
  }

  function compileWithCarver( req, res, next ){

    res.locals.models = caminio.models;
    var Carver      = require('carver'); 
    var compiler    = Carver.init({ 
                          workdir: res.locals.currentDomain.getContentPath()+'/lineup/entry',
                          locals: res.locals });

    compiler.compile( res.locals.doc, next );

  }

  // function compilePages( req, res, next ){
  //   var settingsFile = join( res.locals.currentDomain.contentPath, 'projects', '.settings' );
  //   var types = {'LineupEntry': { layout: { name: 'projects' } }};
  //
  //   if( fs.existsSync( settingsFile+'.js' ) ){
  //     var settingsContent = require( settingsFile );
  //     if( settingsContent.compileDeps )
  //       types = settingsContent.compileDeps;
  //   }
  //
  //   async.eachSeries( Object.keys(types), function( type, nextType ){
  //
  //     var gen = new SiteGen( res.locals.currentDomain.getContentPath(), types[type].namespace );
  //
  //     var q = caminio.models[type].find();
  //     if( types[type].conditions && typeof(types[type].conditions) === 'object' ){
  //       var conditions = {};
  //       for( var key in types[type].conditions )
  //         conditions[key] = ( types[type].conditions._id && types[type].conditions._id === 'PARAM_ID' ) ?
  //                             req.param('id') :
  //                             types[type].conditions[key];
  //       q.where(conditions);
  //     }
  //     
  //     q.exec( function( err, docs ){
  //       async.eachSeries( docs, function( doc, compileNext ){
  //
  //         gen.compileObject( 
  //             doc,
  //             { locals: res.locals,
  //               layout: types[type].layout,
  //               isPublished: (req.doc.status === 'published') },
  //             compileNext );
  //
  //       }, nextType );
  //     });
  //   }, next );
  //
  // }
  //
  
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
      var repairedLabels = [];
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
