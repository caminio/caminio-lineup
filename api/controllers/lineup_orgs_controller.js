/**
 * @class LineupOrgsController
 */
module.exports = function LineupOrgsController( caminio, policies, middleware ){

  return {

    _before: {
      '*': policies.ensureLogin
    }

  };

};