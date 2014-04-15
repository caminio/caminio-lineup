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
    venue: { type: ObjectId, ref: 'LineupOrg' },
    prices: [ LineupPriceSchema ],
    festival: { type: ObjectId, ref: 'LineupOrg' }

  });

  return schema;

};