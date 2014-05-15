(function( App ){
  
  'use strict';

  App.LineupPeopleEditView = Ember.View.extend({

    didInsertElement: function(){

      App.setupCtrlS( this.get('controller.content'), Em.I18n.t('person.saved', {name: this.get('controller.content.name') }) );

      this.$('input[type=text]:visible:first').focus();

    }

  });

  App.LineupPeopleNewView = App.LineupPeopleEditView.extend();

})( App );
