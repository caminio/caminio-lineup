( function( App ){
  
  'use strict';

  App.LineupOrgsEditController = Ember.ObjectController.extend({

    curTranslation: function(){
      return this.get('translations').findBy('locale', App._curLang);
    }.property('App._curLang'),

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

      'goToOrgs': function(){
        this.transitionToRoute('lineup_orgs');
      },

      'setType': function( type ){
        this.get('content').set('type', type);
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
            notify('info', Em.I18n.t('org.saved', {name: self.get('curTranslation.title')}));
            self.transitionToRoute('lineup_orgs.edit', self.get('content.id'));
          });
      }

    }

  });

  App.LineupOrgsNewController = App.LineupOrgsEditController.extend();


})( App );
