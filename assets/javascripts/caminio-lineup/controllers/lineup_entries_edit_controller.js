( function(){
  
  'use strict';

  App.LineupEntriesEditController = Ember.ObjectController.extend({

    availableVenues: Em.A(),
    availablePeople: Em.A(),

    youtubeVideoURL: function(){
      return '//www.youtube-nocookie.com/embed/'+this.get('videoId');
    }.property('videoId'),

    vimeoVideoURL: function(){
      return '//player.vimeo.com/video/'+this.get('videoId')+'?byline=0';
    }.property('videoId'),

    _createTr: function(){
      var tr = this.store.createRecord('translation', { locale: App._curLang,
                                                        content: Em.I18n.t('content_here') });
      this.get('content.translations').pushObject(tr);
    },

    isVimeo: function(){
      return this.get('videoProvider') === 'vimeo';
    }.property('videoProvider'),

    actions: {

      'goToEntries': function(){
        this.transitionToRoute('lineup_entries')
      },

      'toggleVideoProvider': function(){
        if( this.get('videoProvider') === 'youtube' )
          return this.set('videoProvider', 'vimeo');
        return this.set('videoProvider', 'youtube');
      },

      'togglePublished': function(){
        var content = this.get('content');
        content.set('status', content.get('status') === 'draft' ? 'published' : 'published' );
        content
          .save()
          .then(function(){
            if( content.get('status') === 'draft' )
              notify('info', Em.I18n.t('entry.marked_draft', { name: content.get('curTranslation.title') }));
            else
              notify('info', Em.I18n.t('entry.marked_published', { name: content.get('curTranslation.title') }));
          });
      },

      'remove': function( content ){
        content.deleteRecord();
        var self = this;
        content
          .save()
          .then(function(){
            notify('info', Em.I18n.t('entry.deleted', { name: content.get('curTranslation.title') }));
            self.transitionToRoute('lineup_entries');
          });
      },

      'save': function(){
        var self = this;
        if( !this.get('curTranslation.title') ){
          this.set('titleError',true);
          $('#entry-title').focus();
          return notify('error', Em.I18n.t('error.missing_title') );
        }
        this.get('content')
          .save()
          .then(function(){
            notify('info', Em.I18n.t('entry.saved', {name: self.get('curTranslation.title')}));
            self.transitionToRoute('lineup_entries.edit', self.get('content.id'));
          });
      },

      addEvent: function(){
        var evnt = this.store.createRecord('lineup_event', getLineupEventDefaults(this.get('model')));
        this.get('lineup_events').pushObject(evnt);
        evnt.set('editMode',true);
        if( this.get('curEvent') )
          this.get('curEvent').set('editMode',false);
        this.get('curEvent',evnt);
      },

      addJob: function(){
        var evnt = this.store.createRecord('lineup_job');
        this.get('lineup_jobs').pushObject(evnt);
        evnt.set('editMode',true);
        if( this.get('curJob') )
          this.get('curJob').set('editMode',false);
        this.get('curJob',evnt);
      }


    }

  });

  App.LineupEntriesNewController = App.LineupEntriesEditController.extend();


  function getLineupEventDefaults(lineupEntry){
    if( lineupEntry.get('lineup_events.length') > 0 ){
      var evnt = lineupEntry.get('lineup_events.firstObject');
      return {
        prices: evnt.get('prices'),
        venue: evnt.get('venue')
      }
    }
    return {};
  }


}).call();