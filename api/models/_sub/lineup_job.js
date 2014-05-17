/**
 *
 * @class LineupJob
 *
 */
 
module.exports = function LineupJob( caminio, mongoose ){

  var ObjectId = mongoose.Schema.Types.ObjectId;

  var schema = new mongoose.Schema({

    lineup_person: { type: ObjectId, ref: 'LineupPerson', public: true },
    title: { type: String, public: true }

  });

  return schema;

};
