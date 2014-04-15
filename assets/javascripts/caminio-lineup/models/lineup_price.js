( function(){

  'use strict';

  App.LineupPrice = DS.Model.extend({

    name: DS.attr('string'),
    price: DS.attr('number'),
    isPublic: DS.attr('boolean', { defaultValue: true }),
    limited: DS.attr('number')

  });

  Ember.Inflector.inflector.irregular('lineupPrice', 'lineup_prices');

})( App );