/**
 *
 * @class LineupEvent
 *
 */
 
module.exports = function LineupEvent( caminio, mongoose ){

  var fs = require('fs');

  var ObjectId = mongoose.Schema.Types.ObjectId;
  var LineupPriceSchema = require( __dirname+'/lineup_price' )( caminio, mongoose );

  var schema = new mongoose.Schema({

    starts: { type: Date, public: true },
    lineup_org: { type: ObjectId, ref: 'LineupOrg', public: true },
    quota: { type: Number, public: true },
    shop_orders: { type: [ObjectId], ref: 'ShopOrder' },
    festival: { type: ObjectId, ref: 'LineupOrg' },

  });

  // proprietary solution. This should really go somewhere else!!!
  try{
    var ShopPriceSchema = require(__dirname+'/../../../../caminio-shop/api/models/_sub/price')( caminio, mongoose );
    schema.add({ prices: { type: [ShopPriceSchema], public: true }});
  } catch( e ){ console.error(e); caminio.logger.info('lineup events initializing without price schema'); }

  schema.virtual('lineup_entry').get(function(){
    return this.parent().id;
  });

  return schema;

};
