/**
 * @class LineupController
 */
module.exports = function LineupController( caminio, policies, middleware ){

  return {

    _before: {
      '*': policies.ensureLogin
    },

    /**
     * @method index
     */
    'index': [
      function( req, res ){
        res.caminio.render();
      }
    ]

  };

};