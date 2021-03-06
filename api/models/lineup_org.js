
/**
 *
 * @class LineupOrganization
 *
 */
 
var _                 = require('lodash');

module.exports = function LineupOrganization( caminio, mongoose ){

  var ObjectId = mongoose.Schema.Types.ObjectId;
  var Mixed = mongoose.Schema.Types.Mixed;

  var CaminioCarver       = require('caminio-carver')( caminio, mongoose );
  var MediafileSchema = require('caminio-media/mediafile_schema')( caminio, mongoose );

  var schema = new mongoose.Schema({

    updateID: { type: String, public: true },
    
    type: { type: String, public: true, index: true },
  
    mediafiles: { type: [ MediafileSchema ], public: true },

    labels: { type: [ObjectId], public: true },
    
    tags: { type: [String], public: true },

    street: { type: String, public: true },
    zip: { type: String, public: true },
    gkz: { type: String, public: true, index: true },
    city: { type: String, public: true },
    country: { type: String, public: true },
    state: { type: String, public: true },

    members: { type: [ObjectId], ref: 'LineupPerson', public: true },

    extRefId: { type: String, public: true, index: true },
    extRefSrc: { type: String, public: true, index: true },
    extRefNote: { type: String, public: true },
    extRefSyncAt: { type: String, public: true },

    origUrl: { type: String, public: true },
    
    extUrl: { type: String, public: true },
    videoUrl: { type: String, public: true },
    videoType: { type: String, public: true },

    othersWrite: { type: String, public: true },
    notifyMeOnWrite: { type: Boolean, default: true, public: true },

    reachByBus: { type: String, public: true },
    reachByTram: { type: String, public: true },
    reachByTrain: { type: String, public: true },

    openingHours: { type: String, public: true },

    email: { type: String, public: true },
    phone: { type: String, public: true },

    camDomain: { type: ObjectId, ref: 'Domain' },
    createdAt: { type: Date, default: Date.now, public: true },
    createdBy: { type: ObjectId, ref: 'User', public: true },
    updatedAt: { type: Date, default: Date.now, public: true },
    updatedBy: { type: ObjectId, ref: 'User', public: true }

  });
  
  schema.plugin( CaminioCarver.langSchemaExtension );

  return schema;

};
