( function(){

  'use strict';

  App.LineupJob = DS.Model.extend({

    title: DS.attr('string'),
    lineup_person: DS.belongsTo('lineup_person'),
    name: function(){
      return this.get('lineup_person.name');
    }.property('lineup_person'),
    isAuthor: function(){
      return this.get('title') && this.get('title').toLowerCase().match(/^author$|^autor$|^playwright$/);
    }.property('title'),
    isDirector: function(){
      return this.get('title') && this.get('title').toLowerCase().match(/^director$|^regie$|^regisseur$|^inszenierung$|^mis en scene$/);
    }.property('title'),

  });

  Ember.Inflector.inflector.irregular('lineupJob', 'lineup_jobs');

})( App );
