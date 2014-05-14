(function( App ){
  
  'use strict';

  App.LineupEntriesEditView = Ember.View.extend({


    didInsertElement: function(){

      this.$('[data-toggle=popover]').popover({
        html: true,
        trigger: 'hover',
        placement: 'bottom',
        delay: 1000,
        content: function() {
          return $('#'+$(this).attr('id')+'-content').html();
        },
      });

      App.setupCtrlS( this.get('controller.content'), Em.I18n.t('entry.saved', {name: this.get('controller.content.curTranslation.title') }) );

      this.$('input[type=text]:visible:first').focus();

    }

  });

  App.LineupEntriesNewView = App.LineupEntriesEditView.extend();

})( App );
