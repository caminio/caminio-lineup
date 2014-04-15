/**
 *
 * @class LineupPrice
 *
 */
 
module.exports = function LineupPrice( caminio, mongoose ){

  var schema = new mongoose.Schema({

    name: { type: String, public: true },
    price: { type: Number, public: true },
    isPublic: { type: Boolean, public: true, default: true },
    limited: { type: Number, public: true }

  });

  return schema;

};