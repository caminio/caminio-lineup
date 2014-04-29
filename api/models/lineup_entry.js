/**
 *
 * @class LineupEntry
 *
 */

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
    type: { type: String, public: true, index: true },
    status: { type: String, public: true, default: 'draft' },

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

    ensembles: { type: [ObjectId], ref: 'LineupOrg', index: true },
    organizers: { type: [ObjectId], ref: 'LineupOrg', index: true },
    venues: { type: [ObjectId], ref: 'LineupOrg', index: true },

    extRefId: { type: String, public: true, index: true },
    extRefSrc: { type: String, public: true, index: true },
    extRefNote: { type: String, public: true },
    extRefSyncAt: { type: String, public: true },

    origProjectUrl: { type: String, public: true },
    videoId: { type: String, public: true },
    videoProvider: { type: String, public: true },

    premiere: { type: Boolean, default: false, public: true },
    derniere: { type: Boolean, default: false, public: true },
    canceled: { type: Boolean, default: false, public: true },

    othersWrite: { type: String, public: true },
    notifyMeOnWrite: { type: Boolean, default: true, public: true },

    camDomain: { type: ObjectId, ref: 'Domain' },
    createdAt: { type: Date, default: Date.now, public: true },
    createdBy: { type: ObjectId, ref: 'User', public: true },
    updatedAt: { type: Date, default: Date.now, public: true },
    updatedBy: { type: ObjectId, ref: 'User', public: true }


  });

  schema.virtual( 'curTranslation' )
    .get( function(){ return this._curTranslation; } )
    .set( function( value ){  this._curTranslation = value; } );

  schema.pre('save', function(next){
    if( !this.isNew )
      return next();
    this.filename = normalizeFilename( this.translations[0].title );
    next();
  });

  return schema;

};