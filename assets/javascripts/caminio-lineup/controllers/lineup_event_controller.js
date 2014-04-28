( function(){
  
  'use strict';

  App.LineupEventController = Ember.ObjectController.extend({

    isCurrent: function(){
      return this.get('content.id') === this.get('parentController.curEvent.id');
    }.property('parentController.curFile'),

    actions: {
      createVenue: function( name ){
        var venue = this.get('parentController').store.createRecord('lineup_org', { name: name, type: 'venue' });
        this.get('content').set('venue', venue);
      }
    }
  });


}).call();