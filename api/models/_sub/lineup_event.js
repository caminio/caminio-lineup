/**
 *
 * @class LineupEvent
 *
 */
 
module.exports = function LineupEvent( caminio, mongoose ){

  var fs = require('fs');

  var ObjectId = mongoose.Schema.Types.ObjectId;

  var schema = new mongoose.Schema({

    starts: { type: Date, public: true },
    lineup_org: { type: ObjectId, ref: 'LineupOrg', public: true },
    shop_orders: { type: [ObjectId], ref: 'ShopOrder' },

    note: { type: String, public: true },
    bookPhone: { type: String, public: true },
    bookEmail: { type: String, public: true },
    bookUrl: { type: String, public: true },

    concessions: { type: [String], public: true },

    festival: { type: ObjectId, ref: 'LineupOrg' },
    premiere: { type: Boolean, default: false, public: true },
    derniere: { type: Boolean, default: false, public: true },
    cancelled: { type: Boolean, default: false, public: true }


  });

  // proprietary solution. This should really go somewhere else!!!
  try{
    var ShopPriceSchema = require(__dirname+'/../../../../caminio-shop/api/models/_sub/price')( caminio, mongoose );
    schema.add({ 
      prices: { type: [ShopPriceSchema], public: true },
      quota: { type: Number, public: true },
      bookable: { type: Boolean, default: true, public: true }
    });
  } catch( e ){ console.error(e); caminio.logger.info('lineup events initializing without price schema'); }

  schema.virtual('lineup_entry').get(function(){
    return this.parent().id;
  });

  return schema;

};
