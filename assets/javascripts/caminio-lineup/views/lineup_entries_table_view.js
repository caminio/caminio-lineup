(function( App ){
  
  'use strict';

  App.LineupEntriesTableView = Ember.View.extend({

    didInsertElement: function(){
      $(this.$('table.caminio thead .sortable-asc')[3]).click().click();
    },

    removeLoader: function() {
      $('.caminio-table-wrapper').removeClass('loading');
    }.on('didInsertElement')
  });

})( App );
