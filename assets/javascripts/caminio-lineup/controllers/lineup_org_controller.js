( function( App ){
  
  'use strict';

  App.LineupOrgController = App.TableItemController.extend({

    curTranslation: function(){
      return this.get('content.translations').findBy('locale', App._curLang);
    }.property('App._curLang'),

    actions: {

      'editItem': function( item ){
        this.transitionToRoute('lineup_orgs.edit', item.get('id'));
      },

      'togglePublished': function(){
        var content = this.get('content');
        content.set('status', ( !content.get('status') ||  content.get('status') === 'draft' ) ? 'published' : 'draft' );
        content
          .save()
          .then(function(){
            if( content.get('status') === 'draft' )
              notify('info', Em.I18n.t('entry.marked_draft', { name: content.get('curTranslation.title') }));
            else
              notify('info', Em.I18n.t('entry.marked_published', { name: content.get('curTranslation.title') }));
          })
          .catch(function(){
            notify('error', Em.I18n.t('entry.saving_failed', { name: content.get('curTranslation.title') }));
          });
      }

    }


  });


})( App );
