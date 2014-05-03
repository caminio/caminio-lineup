( function(){
  
  'use strict';

  App._curLang = currentDomain.lang;
  
  App.LineupEntriesController = Ember.Controller.extend({
    
    multiLangs: function(){
      return domainSettings.availableLangs.length > 1;
    }.property(),

    availableLangs: function(){
      return domainSettings.availableLangs;
    }.property(),
    
    actions: {

      'changeLang': function( lang ){
        App.set('_curLang',lang);
      },

      newItem: function(){
        this.transitionToRoute('lineup_entries.new');
      }

    }

  });


}).call();