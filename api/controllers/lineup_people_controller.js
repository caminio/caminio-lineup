/**
 * @class LineupPeopleController
 */
module.exports = function LineupPeopleController( caminio, policies, middleware ){

  return {

    _before: {
      '*': policies.ensureLogin
    }

  };

};