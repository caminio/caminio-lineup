/**
 *
 * @class LineupEntry
 *
 */

var _                 = require('lodash');
var join              = require('path').join;
var normalizeFilename = require('caminio/util').normalizeFilename;
 
module.exports = function LineupEntry( caminio, mongoose ){

  var ObjectId = mongoose.Schema.Types.ObjectId;

  var Mixed = mongoose.Schema.Types.Mixed;

  var TranslationSchema = require('caminio-rocksol/translation_schema')( caminio, mongoose );
  var MediafileSchema = require('caminio-media/mediafile_schema')( caminio, mongoose );

  var LineupEventSchema = require( __dirname+'/_sub/lineup_event' )( caminio, mongoose );
  var LineupJobSchema = require( __dirname+'/_sub/lineup_job' )( caminio, mongoose );

  var schema = new mongoose.Schema({

    filename: { type: String, public: true },
    //type: { type: String, public: true, index: true },
    status: { type: String, public: true, default: 'draft' },

    notifyCreatorOnChange: { type: Boolean, public: true, default: true },

    /**
     * @property labels
     * @type ObjectId
     */
    labels: { type: [ObjectId], ref: 'Label', index: true, public: true },

    requestReviewMsg: { type: String, public: true },
    requestReviewBy: { type: ObjectId, ref: 'User', public: true },

    translations: { type: [ TranslationSchema ], public: true },
    mediafiles: { type: [ MediafileSchema ], public: true },
    lineup_events: { type: [ LineupEventSchema ], public: true },

    recommendedAge: { type: Number, public: true, index: true },
    durationMin: { type: Number, public: true },
    numBreaks: { type: Number, public: true },

    lineup_jobs: { type: [ LineupJobSchema ], public: true },

    age: { type: Number, public: true },

    ensembles: { type: [ObjectId], ref: 'LineupOrg', index: true, public: true },
    organizers: { type: [ObjectId], ref: 'LineupOrg', index: true, public: true },

    extRefId: { type: String, public: true, index: true },
    extRefSrc: { type: String, public: true, index: true },
    extRefNote: { type: String, public: true },
    extRefSyncAt: { type: String, public: true },

    origProjectUrl: { type: String, public: true },
    videoId: { type: String, public: true },
    videoProvider: { type: String, public: true },

    othersWrite: { type: String, public: true },
    notifyMeOnWrite: { type: Boolean, default: true, public: true },

    camDomain: { type: ObjectId, ref: 'Domain' },
    createdAt: { type: Date, default: Date.now, public: true },
    createdBy: { type: ObjectId, ref: 'User', public: true },
    updatedAt: { type: Date, default: Date.now, public: true },
    updatedBy: { type: ObjectId, ref: 'User', public: true }


  });

  schema.virtual('curTranslation')
    .get(function(){
      if( !this._curLang )
        return this.translations[0];
      var guess = _.find( this.translations, { locale: this._curLang } );
      if( guess ){ return guess; }
      return this.translations[0];
    });

  schema.virtual('curLang')
    .set(function(lang){
      this._curLang = lang;
    });

  schema.virtual( 'teaser' )
    .get( function(){ return this._teaser; } )
    .set( function(teaser){ this._teaser = teaser; });

  schema.pre('save', function(next){
    if(this.filename)
      this.filename = normalizeFilename( this.filename );
    if( !this.isNew )
      return next();
    if( !this.filename )
      this.filename = normalizeFilename( this.translations[0].title );
    next();
  });
  
  schema.virtual('absoluteUrl')
    .get(function(){
      return this.url();
    });

  schema.methods.url = function url(){
    
    if( this.translations.length === 1 )
        return this._path + '/' + this.filename + '.htm';
    // if( lang )
    //     return this._path + '/' + this.filename + '.' + lang + '.htm';
    return this._path + '/' + this.filename + '.' + this._curLang + '.htm';

  };

  schema.virtual('relPath')
    .get(function(){
      return join( 'projekte', this.filename );
    });

  schema.virtual('absPath')
    .get(function(){
      return join( '/', this.curTranslation.locale, 'projekte', this.filename );
    });

  schema.methods.hasTranslation = function( lang ){
    return _.find( this.translations, { locale: lang } );
  };

  schema.publicAttributes = ['absoluteUrl', 'relPath'];

  return schema;


};
