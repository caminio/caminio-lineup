/**
 *
 * @class LineupPerson
 *
 */

module.exports = function LineupPerson( caminio, mongoose ){

  'use strict';
 
  var _ = require('lodash');

  var ObjectId = mongoose.Schema.Types.ObjectId;

  var CaminioCarver       = require('caminio-carver')( caminio, mongoose );
  var MediafileSchema = require('caminio-media/mediafile_schema')( caminio, mongoose );

  var schema = new mongoose.Schema({

    type: { type: String, public: true, index: true },
    mediafiles: { type: [ MediafileSchema ], public: true },

    tags: { type: [String], public: true },

    firstname: { type: String, public: true },
    midname: { type: String, public: true },
    lastname: { type: String, public: true },
    
    street: { type: String, public: true },
    zip: { type: String, public: true },
    gkz: { type: String, public: true, index: true },
    city: { type: String, public: true },
    country: { type: String, public: true },
    state: { type: String, public: true },

    extRefId: { type: String, public: true, index: true },
    extRefSrc: { type: String, public: true, index: true },
    extRefNote: { type: String, public: true },
    extRefSyncAt: { type: String, public: true },

    extUrl: { type: String, public: true },
    videoUrl: { type: String, public: true },
    videoType: { type: String, public: true },

    othersWrite: { type: String, public: true },
    notifyMeOnWrite: { type: Boolean, default: true, public: true },

    camDomain: { type: ObjectId, ref: 'Domain' },
    createdAt: { type: Date, default: Date.now, public: true },
    createdBy: { type: ObjectId, ref: 'User', public: true },
    updatedAt: { type: Date, default: Date.now, public: true },
    updatedBy: { type: ObjectId, ref: 'User', public: true }

  });

  schema.virtual('name')
    .get(function(){
      var str = '';
      if( this.firstname )
        str += this.firstname;
      if( str.lastname ){
        if( str.length > 0 )
          str += ' ';
        str += this.lastname;
      }
    });

  schema.plugin( CaminioCarver.langSchemaExtension, { fileSupport: false });
  schema.publicAttributes = [ 'name' ];
  
  return schema;

};
