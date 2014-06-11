( function( App ){
  
  'use strict';

  App.LineupPeopleEditController = Ember.ObjectController.extend({

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

      'toggleVideoProvider': function(){
        if( this.get('videoProvider') === 'youtube' )
          return this.set('videoProvider', 'vimeo');
        return this.set('videoProvider', 'youtube');
      },

      'changeLang': function( lang ){
        var tr = this.get('content.translations').find( function( tr ){
          return tr.get('locale') === lang;
        });
        if( !tr ){
          tr = this.store.createRecord('translation', { locale: lang,
                                                        title: this.get('content.curTranslation.title'),
                                                        subtitle: this.get('content.curTranslation.subtitle'),
                                                        aside: this.get('content.curTranslation.aside'),
                                                        content: this.get('content.curTranslation.content') });
          this.get('content.translations').pushObject( tr );
        }

        App.set('_curLang', lang);

      },

      'goToPeople': function(){
        this.transitionToRoute('lineup_people');
      },

      'setType': function( type ){
        this.get('content').set('type', type);
      },

      'remove': function( content ){
        var self = this;
        bootbox.confirm( Em.I18n.t('entry.really_delete', {name: content.get('curTranslation.title')}), function(result){
          if( !result )
            return;
          content.deleteRecord();
          content
            .save()
            .then(function(){
              notify('info', Em.I18n.t('entry.deleted', { name: content.get('curTranslation.title') }));
              self.transitionToRoute('lineup_people');
            });
        });
      },

      'save': function(){
        var self = this;
        if( !this.get('firstname') ){
          this.set('firstnameError',true);
          $('#entry-firstname').focus();
          return notify('error', Em.I18n.t('error.missing_firstname') );
        }
        this.get('content')
          .save()
          .then(function(){
            notify('info', Em.I18n.t('person.saved', {name: self.get('curTranslation.title')}));
            self.transitionToRoute('lineup_people.edit', self.get('content.id'));
          });
      }

    }

  });

  App.LineupPeopleNewController = App.LineupPeopleEditController.extend();


})( App );
