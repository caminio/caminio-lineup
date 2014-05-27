( function(){
  
  'use strict';
  
  App.LineupEntriesEditController = Ember.ObjectController.extend({

    availableVenues: Em.A(),
    availablePeople: Em.A(),
    availableEnsembles: Em.A(),
    availableLabels: Em.A(),
    
    editSettings: false,

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

    domainCategories: function(){
      return domainSettings.lineupCategories || [ 'Theater Tanz Performance', 'Junges Publikum', 'Kabaret', 'Festival' ];
    }.property(),

    isVimeo: function(){
      return this.get('videoProvider') === 'vimeo';
    }.property('videoProvider'),

    arrangedEvents: function(){
      return this.get('lineup_events').sortBy('starts').toArray().reverse();
    }.property('lineup_events.@each'),

    actions: {

      'cancelNewEntry': function(){
        this.get('model').deleteRecord();
        this.transitionToRoute('lineup_entries');
      },

      'toggleEditSettings': function(){
        this.set('editSettings', !this.get('editSettings'));
      },

      'goToEntries': function(){
        this.transitionToRoute('lineup_entries');
      },

      'toggleVideoProvider': function(){
        if( this.get('videoProvider') === 'youtube' )
          return this.set('videoProvider', 'vimeo');
        return this.set('videoProvider', 'youtube');
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

      'remove': function( content ){
        var self = this;
        bootbox.confirm( Em.I18n.t('entry.really_delete', {name: content.get('name')}), function(result){
          if( !result )
            return;
          content.deleteRecord();
          content
            .save()
            .then(function(){
              notify('info', Em.I18n.t('entry.deleted', { name: content.get('curTranslation.title') }));
              self.transitionToRoute('lineup_entries');
            });
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
            self.get('content').reload();
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
        var job = this.store.createRecord('lineup_job');
        this.get('lineup_jobs').pushObject(job);
        job.set('editMode',true);
        if( this.get('curJob') )
          this.get('curJob').set('editMode',false);
        this.get('curJob',job);
        $('#lineup-jobs').sortable('refresh');
      },
      
      removeLabel: function( label ){
        bootbox.confirm( Em.I18n.t('label.really_delete', {name: label.get('name')}), function( result ){
          if( result ){
            label.deleteRecord();
            label.save()
              .then(function(){
                notify('info', Em.I18n.t('label.deleted', {name: label.get('name')}));
              })
              .catch( function(err){
                notify('error', err);
              });
          }
        });
      },

      toggleLabel: function( label ){
        var found = this.get('content.labels').find( function(_label){
          if( label.get('id') === _label.get('id') )
            return true;
        });
        if( found )
          this.get('content.labels').removeObject(label);
        else
          this.get('content.labels').pushObject(label);
      },

      createEnsemble: function( value, $obj ){
        var self = this;
        var ensemble = this.store.createRecord('lineup_org', { type: 'ensemble' });
        var tr = this.store.createRecord('translation', {locale: App._curLang,
                                                                                title: value });
        ensemble.get('translations').pushObject(tr);
        ensemble.set('curTranslation', tr);

        ensemble
          .save()
          .then(function(){
            notify('info', Em.I18n.t('ensemble.created', { name: ensemble.get('curTranslation.title') }));
            self.get('availableEnsembles').pushObject( ensemble );
            self.get('content.ensembles').pushObject(ensemble);
            $obj.append('<option value="'+ensemble.get('id')+'">'+ensemble.get('curTranslation.title')+'</option>');
            $obj.select2('val', '');
          });
      },

      addEnsemble: function( value, $obj ){
        var ensemble = this.store.getById('lineup_org', value);
        this.get('content.ensembles').pushObject(ensemble);
        this.get('content').send('becomeDirty');
        $obj.select2('val','');
      },

      addAuthor: function( value, $obj ){
        addAuthorOrDirector.call( this, value, $obj, Em.I18n.t('job.author') );
      },
      addDirector: function( value, $obj ){
        addAuthorOrDirector.call( this, value, $obj, Em.I18n.t('job.director') );
      },
      createAuthor: function( value, $obj ){
        createAuthorOrDirector.call( this, value, $obj, Em.I18n.t('job.author') );
      },
      createDirector: function( value, $obj ){
        createAuthorOrDirector.call( this, value, $obj, Em.I18n.t('job.director') );
      },

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

  App.EnsemblesItemController = Ember.ObjectController.extend({
    actions: {
      goToEnsemble: function(){
        this.transitionToRoute('lineup_orgs.edit', this.get('content.id'));
      },
      removeEnsemble: function(){
        this.get('parentController.content.ensembles').removeObject( this.get('content') );
        this.get('parentController.content').send('becomeDirty');
      }
    }
  });

  App.JobsItemController = Ember.ObjectController.extend({
    actions: {
      goToPerson: function(){
        this.transitionToRoute('lineup_people.edit', this.get('content.id'));
      },
      removePerson: function(){
        this.get('parentController.content.lineup_jobs').removeObject( this.get('content') );
        this.get('parentController.content').send('becomeDirty');
      }
    }
  });

  function addAuthorOrDirector( value, $obj, title ){
    var person = this.store.getById('lineup_person', value);
    var job = this.store.createRecord('lineup_job', { title: title, lineup_person: person });
    this.get('content.lineup_jobs').pushObject( job );
    this.get('content').send('becomeDirty');
    $obj.select2('val','');
  };

  function createAuthorOrDirector( value, $obj, title ){
    var self = this;
    var person = this.store.createRecord('lineup_person', { name: value });
    var tr = this.store.createRecord('translation', { locale: App._curLang });
    person.get('translations').pushObject(tr);
    person.set('curTranslation', tr);

    person
      .save()
      .then(function(){
        notify('info', Em.I18n.t('person.created', { name: person.get('name') }));
        self.get('availablePeople').pushObject( person );
        
        var job = self.store.createRecord('lineup_job', { title: title, lineup_person: person });
        self.get('content.lineup_jobs').pushObject( job );
        $obj.append('<option value="'+person.get('id')+'">'+person.get('name')+'</option>');
        $obj.select2('val', '');
      });
  };

}).call();
