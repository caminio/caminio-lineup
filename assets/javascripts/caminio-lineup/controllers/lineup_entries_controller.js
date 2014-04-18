( function(){
  
  'use strict';

  App.LineupEntriesController = Ember.Controller.extend({
    
    actions: {

      newItem: function(){
        this.transitionToRoute('lineup_entries.new');
      }

    }

  });


}).call();