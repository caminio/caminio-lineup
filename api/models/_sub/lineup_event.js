/**
 *
 * @class LineupEvent
 *
 */
 
module.exports = function LineupEvent( caminio, mongoose ){

  var ObjectId = mongoose.Schema.Types.ObjectId;
  var LineupPriceSchema = require( __dirname+'/lineup_price' )( caminio, mongoose );

  var schema = new mongoose.Schema({

    starts: { type: Date, public: true },
    lineup_org: { type: ObjectId, ref: 'LineupOrg', public: true },
    quota: { type: Number, public: true },
    shop_orders: { type: [ObjectId], ref: 'ShopOrder' },
    prices: [ LineupPriceSchema ],
    festival: { type: ObjectId, ref: 'LineupOrg' },

  });

  schema.virtual('lineup_entry').get(function(){
    return this.parent().id;
  });

  return schema;

};
