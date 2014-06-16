( function( App ){

  'use strict';

  App.LabelItemController = Em.ObjectController.extend({
    isActive: function(){
      return this.get('parentController.searchQ.labels').findBy('id', this.get('content.id') );
    }.property('parentController.searchQ.labels.@each'),
    actions: {
      'removeLabel': function( label ){
        var self = this;
        bootbox.confirm( Em.I18n.t('label.really_delete', {name: label.get('name')}), function( result ){
          if( result ){
            label.deleteRecord();
            label.save()
              .then(function(){
                App.set('_availableLabels', self.store.find('label', { type: 'lineup' }));
                notify('info', Em.I18n.t('label.deleted', {name: label.get('name')}));
              })
              .catch( function(err){
                notify('error', err);
              });
          }
        });
      }
    }
  });

})( App );
