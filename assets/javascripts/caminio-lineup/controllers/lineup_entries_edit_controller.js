( function(){
  
  'use strict';
  
  App.LineupEntriesEditController = Ember.ObjectController.extend({

    availableVenues: Em.A(),
    availablePeople: Em.A(),
    availableLabels: Em.A(),
    
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
          })
          .fail(function(){
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
        bootbox.confirm( Em.I18n.t('entry.really_delete', {name: content.get('name')}), function(result){
          if( !result )
            return;
          content.deleteRecord();
          var self = this;
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
        var found = this.content.get('labels').find( function(label){
          if( label.get('id') === label.get('id') )
            return true;
        });
        if( found )
          this.content.get('labels').removeObject(label);
        else
          this.content.get('labels').pushObject(label);
      },

      editLabel: function( label ){

        var store = this.store;
        if( !label )
          label = store.createRecord('label', { type: 'lineup_entry' });

        bootbox.dialog({ title: Em.I18n.t('name'), 
                         message: getEditLabelContent( label ),
                         className: 'edit-label-modal',
                         buttons: {
                            save: {
                              label: Em.I18n.t('save'),
                              className: "primary",
                              callback: saveEvent
                            }
                          }
                        }).on('shown.bs.modal', onShowBootbox)
                          .on('hide.bs.modal', onHideBootbox);

        function onShowBootbox(){
          var $box = $(this);

          $box.find('form').on('submit', function(e){ 
            e.preventDefault(); 
            saveEvent();
            $box.modal('hide');
          });
          setTimeout(function(){
            $box.find('input[type=text]:first').focus();
          },500);
          $box.find('.color').on('click', function(){
            $box.find('.color').removeClass('active');
            $(this).addClass('active');
          });
          $box.find('input[type=checkbox]').attr('checked',label.get('private'));
          $box.find('.color[data-bg-color='+label.get('bgColor')+']').addClass('active');
        }

        function onHideBootbox(){
          if( label.isDirty )
            label.deleteRecord();
        }
        function saveEvent(){
          var $color = $('.bootbox .color.active');
          if( !$color.length )
            $color = $('.bootbox .color:first').addClass('active');

          label.set('bgColor', $color.attr('data-bg-color'));
          label.set('fgColor', $color.attr('data-fg-color'));
          label.set('borderColor', $color.attr('data-border-color'));

          var user = store.getById('user', currentUser._id);
          if( $('.bootbox .private').is(':checked') ){
            label.get('usersAccess').pushObject( user );
          } else {
            label.get('usersAccess').removeObject( user );
          }

          label.set('name', $('.edit-label-modal .name').val());
          saveLabel();
        }

        function saveLabel(){
          var newRecord = label.id ? false : true;
          label
            .save()
            .then( function(label){
              if( newRecord )
                notify('info', Em.I18n.t('label.created', {name: label.get('name')}) );
              else
                notify('info', Em.I18n.t('label.saved', {name: label.get('name')}) );
            })
            .catch( function(err){
              console.error(err);
              notify('error', err);
            });
        }

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

  function getEditLabelContent( label ){
    var str = '<form class="bootbox-form">'+
              '<div class="form-group row">'+
              '<input type="text" value="'+(label.get('name') || '')+'" autocomplete="off" class="bootbox-input bootbox-input-text form-control name col-md-12">'+
              '</div>'+
              '<div class="row margin-top clearfix colors"><label class="control-label col-md-3">'+Em.I18n.t('label.select_color')+'</label>'+
                '<div class="col-md-9">'+
                  App.getLabelColors()+
                '</div>'+
              '</div>'+
              '<div class="row margin-top clearfix colors"><label class="control-label col-md-3">'+Em.I18n.t('label.private')+'</label>'+
                '<div class="col-md-9">'+
                  '<input type="checkbox" class="private">'+
                '</div>'+
              '</div>'+
              '</form>';
    return str;
  }

}).call();