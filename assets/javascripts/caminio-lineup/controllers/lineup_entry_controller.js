( function(){
  
  'use strict';

  App.LineupEntryController = Ember.Controller.extend({

    curTranslation: function(){
      return this.get('content.translations').findBy('locale', App._curLang);
    }.property('App._curLang'),

    period: function(){
      var first, last;
      this.get('content.lineup_events').forEach(function(e){
        if( !first || e.get('starts') <= first )
          first = e.get('starts');
        if( !last || e.get('starts') >= last )
          last = e.get('starts');
      });
      if( first && last )
        return moment(first).format('DD.MMM.') + ' &ndash; ' + moment(last).format('DD.MMM.');
      return '';
    }.property('lineup_events.@each'),

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
        this.transitionToRoute('lineup_entries.edit', item.get('id'));
      }
    }


  });


}).call();