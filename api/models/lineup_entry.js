/**
 *
 * @class LineupEntry
 *
 */

module.exports = function LineupEntry( caminio, mongoose ){

  'use strict';

  var _                   = require('lodash');

  var ObjectId            = mongoose.Schema.Types.ObjectId;

  var CaminioCarver       = require('caminio-carver')( caminio, mongoose );

  var MediafileSchema     = require('caminio-media/mediafile_schema')( caminio, mongoose );

  var LineupEventSchema   = require( __dirname+'/_sub/lineup_event' )( caminio, mongoose );
  var LineupJobSchema     = require( __dirname+'/_sub/lineup_job' )( caminio, mongoose );

  var schema = new mongoose.Schema({

    //type: { type: String, public: true, index: true },

    notifyCreatorOnChange: { type: Boolean, public: true, default: true },

    /**
     * @property labels
     * @type ObjectId
     */
    labels: [{ type: ObjectId, ref: 'Label', index: true }],

    categories: { type: [String], public: true },

    requestReviewMsg: { type: String, public: true },
    requestReviewBy: { type: ObjectId, ref: 'User', public: true },

    mediafiles: { type: [ MediafileSchema ], public: true },
    lineup_events: { type: [ LineupEventSchema ], public: true },

    recommendedAge: { type: Number, public: true, index: true },
    durationMin: { type: Number, public: true },
    numBreaks: { type: Number, public: true },

    lineup_jobs: { type: [ LineupJobSchema ], public: true },

    age: { type: Number, public: true },

    ensembles: [{ type: ObjectId, ref: 'LineupOrg', index: true }],
    organizers: [{ type: ObjectId, ref: 'LineupOrg', index: true }],

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

  schema.publicAttributes = ['absoluteUrl', 'relPath', 'labels', 'ensembles', 'organizers'];
  schema.trash = true;
  schema.plugin( CaminioCarver.langSchemaExtension, { fileSupport: true } );

  schema.virtual('authors').get(function(){
    return _.filter(this.lineup_jobs, function(job){ return job.title.match(/author|autor|text|playwright/i); });
  });

  schema.virtual('directors').get(function(){
    return _.filter(this.lineup_jobs, function(job){ return job.title.match(/director|directing|regie|inszenierung/i); });
  });


  return schema;

};
