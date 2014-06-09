module.exports = function ( caminio ){

  'use strict';

  return {
    dat: require('./dialects/dat')( caminio )
  };

};
