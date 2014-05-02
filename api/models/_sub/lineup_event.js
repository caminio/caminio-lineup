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
    prices: [ LineupPriceSchema ],
    festival: { type: ObjectId, ref: 'LineupOrg' }

  });

  return schema;

};