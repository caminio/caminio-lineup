(function( App ){
  
  'use strict';

  App.LineupOrgsEditView = Ember.View.extend({

    didInsertElement: function(){

      App.setupCtrlS( this.get('controller.content'), Em.I18n.t('org.saved', {name: this.get('controller.content.curTranslation.title') }) );

      this.$('input[type=text]:visible:first').focus();

    }

  });

  App.LineupOrgsNewView = App.LineupOrgsEditView.extend();

})( App );
