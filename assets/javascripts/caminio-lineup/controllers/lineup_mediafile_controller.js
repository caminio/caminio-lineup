( function(){
  
  'use strict';

  App.LineupMediafileController = Ember.ObjectController.extend({
    actions: {
      'removeMediafile': function(){
        var file = this.get('content');
        var controller = this.get('parentController');
        bootbox.confirm( Em.I18n.t('file.really_delete', {name: file.get('name')}), function(result){
          if( !result )
            return;
          file.deleteRecord();
          file.save().then(function(){
            notify('info', Em.I18n.t('file.deleted', { name: file.get('name') }));
            controller.set('mediafiles', App.Mediafile.store.all('mediafile', {parent: controller.get('model.id')}));
          });
        });
      }
    }
  });


}).call();