( function(){
  
  'use strict';

  App.LineupEntryController = App.TableItemController.extend({

    period: function(){
      var first, last;
      this.get('content.lineup_events').forEach(function(e){
        if( !first || e.get('starts') <= first )
          first = e.get('starts');
        if( !last || e.get('starts') >= last )
          last = e.get('starts');
      });
      if( first && this.get('content.lineup_events.length') < 2 )
        return new Handlebars.SafeString(moment(first).format('DD.MMM. HH:mm') );
      if( first && last )
        return new Handlebars.SafeString(moment(first).format('DD.MMM.') + ' &ndash; ' + moment(last).format('DD.MMM.'));
      return '';
    }.property('lineup_events.@each'),

    actions: {

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
      },

      'editItem': function( item ){
        this.transitionToRoute('lineup_entries.edit', item.get('id'));
      }

    }


  });


}).call();
