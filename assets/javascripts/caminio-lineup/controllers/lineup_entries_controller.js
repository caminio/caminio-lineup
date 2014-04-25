( function(){
  
  'use strict';

  App.LineupEntriesController = Ember.Controller.extend({
    
    curLang: currentDomain.lang,
    
    actions: {

      newItem: function(){
        this.transitionToRoute('lineup_entries.new');
      }

    }

  });


}).call();