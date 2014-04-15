( function(){

  'use strict';

  App.LineupEvent = DS.Model.extend({

    starts: DS.attr('date'),
    venue: DS.belongsTo('lineup_venue'),
    festival: DS.belongsTo('lineup_entry'),
    prices: DS.hasMany('lineup_price')

  });

  Ember.Inflector.inflector.irregular('lineupEvent', 'lineup_events');

})( App );