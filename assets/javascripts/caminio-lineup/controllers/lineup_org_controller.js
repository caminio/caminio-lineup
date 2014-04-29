( function(){
  
  'use strict';

  App.LineupOrgController = Ember.Controller.extend({

    curTranslation: function(){
      return this.get('content.translations').findBy('locale', App._curLang);
    }.property('App._curLang'),

    actions: {
      'removeItem': function(){
        var item = this.get('model');
        bootbox.confirm(Em.I18n.t('item.really_delete', {itemNum: item.get('itemNum'), name: item.get('name')}), function(result){
          if( !result )
            return;

          item.deleteRecord();
          item.save().then(function(){
            notify('info', Em.I18n.t('item.deleted', { itemNum: item.get('itemNum'), name: item.get('name') }));
          });
          Ember.View.views[$('.form-item-container:visible').closest('.ember-view').attr('id')].destroy();
        });
      },
      'editItem': function( item ){
        this.transitionToRoute('lineup_orgs.edit', item.get('id'));
      }
    }


  });


}).call();