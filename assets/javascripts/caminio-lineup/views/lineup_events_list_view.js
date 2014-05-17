(function( App ){
  
  'use strict';

  App.LineupEventsListView = Ember.View.extend({

    templateName: 'lineup_events/list',

    didInsertElement: function(){
      this.$().on('mouseenter', '.datepicker', function(e){
        if( $(this).hasClass('hasDatepicker') )
          return;
        $(this).datepicker({
          prevText: '',
          nextText: '',
          dateFormat: 'yy-mm-dd'
        });
      });

      this.$().on('mouseenter', '.timepicker', function(e){
        if( $(this).hasClass('hasTimepicker') )
          return;

        $(this).caminioTimepicker();
      });
    }

  });

})( App );
