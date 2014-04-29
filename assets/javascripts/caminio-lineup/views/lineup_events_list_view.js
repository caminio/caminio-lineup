(function( App ){
  
  'use strict';

  App.LineupEventsListView = Ember.View.extend({

    templateName: 'lineup_events/list',

    didInsertElement: function(){
      this.$().on('click', '.datepicker', function(){
        var $elem = $(this).is('input[type=text]') ? $(this) : $(this).prev('input[type=text]');
        if( !$elem.data('datepicker') )
          $elem.datepicker({
            prevText: '',
            nextText: '',
            dateFormat: 'yy-mm-dd'
          });
      });
    }

  });

})( App );