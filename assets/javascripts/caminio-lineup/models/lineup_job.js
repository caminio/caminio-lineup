( function(){

  'use strict';

  App.LineupJob = DS.Model.extend({

    name: DS.attr('string'),
    lineup_person: DS.belongsTo('lineup_person')

  });

  Ember.Inflector.inflector.irregular('lineupJob', 'lineup_jobs');

})( App );