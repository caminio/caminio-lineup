( function(){
  
  'use strict';

  App.LineupOrgsController = Ember.Controller.extend({
    
    curLang: currentDomain.lang,
    
    actions: {

      newItem: function(){
        this.transitionToRoute('lineup_venues.new');
      }

    }

  });

  App.LineupVenuesController = App.LineupOrgsController.extend();

}).call();