( function(){
  
  'use strict';

  App.LineupEntryController = Ember.Controller.extend({

    shopCategories: function(){
      return [];
    }.property('curItem'),

    actions: {
      'closeDetails': function(){
        $('#item-details').hide();
        $('#items-table').addClass('col-md-8').removeClass('col-md-4');
        $('#search-items').delay(500).fadeIn();
        Ember.View.views[$('#item-details .ember-view').attr('id')].destroy();
      },
      'saveDetails': function(){
        var item = this.get('model');
        item.save().then(function(){
          notify('info', Em.I18n.t('item.saved', { itemNum: item.get('itemNum'), name: item.get('name') }));
        });
      },
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
      'showItem': function(){
        this.transitionToRoute('shop_items.edit', this.get('content.id'));
      }
    }


  });


}).call();