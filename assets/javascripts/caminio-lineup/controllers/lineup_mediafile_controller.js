( function(){
  
  'use strict';

  App.LineupMediafileController = Ember.ObjectController.extend({

    isCurrent: function(){
      return this.get('content.id') === this.get('parentController.curFile.id');
    }.property('parentController.curFile'),

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
            controller.set('mediafiles', App.Mediafile.store.find('mediafile', {parent: controller.get('model.id')}));
          });
        });
      },

      showFileDetails: function( mediafile ){
        this.get('parentController').send('editMediafileModal', mediafile);
      }

    }
  });


}).call();