var fs        = require('fs');
var join      = require('path').join;
var mkdirp    = require('mkdirp');
var transformJSON = require('caminio/util').transformJSON;

/**
 * @class LineupEntriesController
 */
module.exports = function LineupEntriesController( caminio, policies, middleware ){

  var SiteGen        = require('caminio-rocksol/site_gen')( caminio );

  var LineupEntry = caminio.models.LineupEntry;

  return {

    _before: {
      '*': policies.ensureLogin,
      'update': [
              getLineupEntry,
              removeFiles,
              saveLineupEntry ]
    },

    'update': function updateLineupEntry(req, res ){
      var options = {};

      if( req.lineup_entry.status === 'published' || req.lineup_entry.status === 'draft'  )
        SiteGen.compilePage( res, req.lineup_entry, options, 'Projekt', finalResponse );
      else
        finalResponse();
      
      function finalResponse( err ){
        if( err )
          return res.json( 500, { error: 'compile_error', details: err });
        var projektePath = res.locals.currentDomain.getContentPath() + '/public/projkte/';
        if( !fs.existsSync(projektePath) )
          mkdirp.sync( projektePath );
        req.lineup_entry.translations.forEach(function(tr){
          fs.writeFileSync( projektePath + req.lineup_entry.filename + '.' + tr.locale + '.htm' );
        });
        if( req.lineup_entry.parent && typeof( req.lineup_entry.parent) === 'object' )
          req.lineup_entry.parent = req.lineup_entry.parent._id;
        LineupEntry.findOne({ '_id': req.lineup_entry._id })
        .exec( function( err, lineup_entry ){
          res.json( transformJSON( { lineup_entry: JSON.parse(JSON.stringify(lineup_entry)) }, req.header('namespaced') ) );
        });
      }
    }

  };

  function getLineupEntry( req, res, next ){
    LineupEntry.findOne({ _id: req.param('id') }, function( err, lineup_entry ){
      if( err )
        return res.json( 500, { error: 'server_error', details: err });
      if( !lineup_entry )
        return res.json(404, { error: 'not_found' });
      req.lineup_entry = lineup_entry;

      if( req.body.lineup_entry )
        if( req.lineup_entry.name !== req.body.lineup_entry.name )
          req.removeFiles = true;
        else
          req.removeFiles = false;

      next();
    });
  }

  function removeFiles( req, res, next ){
    var path = join( res.locals.currentDomain.getContentPath(), 'public');
    path = join( path, req.lineup_entry.filename );

    if( req.removeFiles ){
      if( fs.existsSync( file ))
        fs.unlinkSync( file );
      }
    next();
  }

  function saveLineupEntry( req, res, next ){
    req.body.lineup_entry.updatedBy = res.locals.currentUser;
    req.body.lineup_entry.camDomain = res.locals.currentDomain;
    req.lineup_entry.update( req.body.lineup_entry, function( err ){
      if( err )
        return res.json(500, { error: 'server_error', details: err  });
      LineupEntry.findOne({_id: req.param('id')}, function( err, lineup_entry ){
        if( err )
          return res.json( 500, { error: 'server_error', details: err });
      req.lineup_entry = lineup_entry;
        return next();
      });
    });
  }


  // function repairTrIds( req, res, next ){
  //   if( req.body.lineup_entry && req.body.lineup_entry.translations && req.body.lineup_entry.translations.length > 0 )
  //     req.body.lineup_entry.translations.forEach(function(translation){
  //       if( '_id' in translation && translation._id === null )
  //         delete translation._id;
  //     });
  //   next();

  // }

};