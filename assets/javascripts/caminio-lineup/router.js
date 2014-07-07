( function( App ){

  /* global domainSettings */

  'use strict';

  App.Router.map( function(){
    this.resource('lineup_entries');
    this.resource('lineup_entries.edit', { path: '/lineup_entries/edit/:id' });
    this.resource('lineup_entries.new', { path: '/lineup_entries/new' });
    this.resource('lineup_orgs');
    this.resource('lineup_orgs.edit', { path: '/lineup_org/edit/:id' });
    this.resource('lineup_orgs.new', { path: '/lineup_org/new' });
    this.resource('lineup_people');
    this.resource('lineup_people.edit', { path: '/lineup_person/edit/:id'});
    this.resource('lineup_people.new', { path: '/lineup_person/new'});
  });

  App.IndexRoute = Ember.Route.extend({
    redirect: function(){
      this.transitionTo('lineup_entries');
    }
  });

  App.set('_defaultJobs', domainSettings.lineupDefaultJobs);
  App.set('_availableFestivals', Em.A());

  /**
   * LineupEntries
   */
  App.LineupEntriesRoute = Ember.Route.extend({
    
    model: function(){
      var opts = { 'lineup_events.starts': 'gteDate('+moment().startOf('day').toISOString()+')' };
      if( !App.get('emberUser.isTrusted') )
        opts.createdBy = App.get('emberUser.id');
      return this.store.find('lineup_entry', opts);
    },

    setupController: function(controller, model){
      var c = this.controllerFor('lineup_entries_table');
      c.set('model', model);
    },

    renderTemplate: function(){
      this.render();
      this.render( 'lineup_entries.table', { into: 'lineup_entries', outlet: 'table', controller: 'lineup_entries_table' });
    }

  });

  /**
   * LineupEntries.New
   */
  App.LineupEntriesNewRoute = Ember.Route.extend({

    model: function( ){
      var defaultCategories = domainSettings.lineupDefaultCategories || [];
      return this.store.createRecord('lineup_entry', { categories: defaultCategories });
    },

    setupController: function( controller, model ){
      controller.set('model',model);
      controller._createTr( model );
    }

  });

  /**
   * LineupEntries.Edit
   */
  App.LineupEntriesEditRoute = Ember.Route.extend({

    model: function( params ){
      return this.store.find('lineup_entry', params.id);
    },

    setupController: function( controller, model ){
      this.store.find('mediafile', { parent: model.get('id'), order: 'position:asc' }).then(function(mediafiles){
        controller.set('mediafiles',mediafiles);
      });
      this.store.all('lineup_org').forEach(function(org){
        if( org.get('type') === 'venue' ) 
          controller.get('availableVenues').pushObject(org);
        else if( org.get('type') === 'ensemble' )
          controller.get('availableEnsembles').pushObject(org);
      });
      this.store.all('lineup_person').forEach(function(person){
        controller.get('availablePeople').pushObject(person);
      });
      controller.set('model',model);
    },

    actions: { 

      editMediafileModal: function( mediafile ){
        var c = this.controllerFor('mediafile_editor');
        c.set('model', mediafile);
        c.set('curRoute', this);
        this.render('mediafile_editor', {
          into: 'lineup_entries.edit',
          outlet: 'modal'
        });
      },

      closeModal: function( deletedMediafile ){
        if( deletedMediafile )
          this.get('controller.mediafiles').removeObject(deletedMediafile);
        this.disconnectOutlet({
          outlet: 'modal',
          parentView: 'lineup_entries.edit'
        });
      }

    }

  });

  /**
   * LineupOrgs
   */
  App.LineupOrgsRoute = Ember.Route.extend({

    setupController: function(controller, model){
      var c = this.controllerFor('lineup_orgs_table');
      c.set('model', this.store.all('lineup_org'));
    },

    renderTemplate: function(){
      this.render();
      this.render( 'lineup_orgs.table', { into: 'lineup_orgs', outlet: 'table', controller: 'lineup_orgs_table' });
    }

  });

  /**
   * LineupOrgs.New
   */
  App.LineupOrgsNewRoute = Ember.Route.extend({

    model: function(){
      return this.store.createRecord('lineup_org');
    },

    setupController: function( controller, model ){
      controller.set('model',model);
      controller._createTr( model );
    }

  });

  /**
   * LineupOrgs.Edit
   */
  App.LineupOrgsEditRoute = Ember.Route.extend({

    beforeModel: function(){
      return this.store.find('lineup_org');
    },

    model: function( params ){
      return this.store.find('lineup_org', params.id);
    },

    setupController: function( controller, model ){
      this.store.find('mediafile', { parent: model.get('id'), order: 'position:asc'}).then(function(mediafiles){
        controller.set('mediafiles',mediafiles);
      });
      controller.set('model',model);
    },

    actions: { 

      editMediafileModal: function( mediafile ){
        var c = this.controllerFor('mediafile_editor');
        c.set('model', mediafile);
        c.set('curRoute', this);
        this.render('mediafile_editor', {
          into: 'lineup_orgs.edit',
          outlet: 'modal'
        });
      },

      closeModal: function( deletedMediafile ){
        if( deletedMediafile )
          this.get('controller.mediafiles').removeObject(deletedMediafile);
        this.disconnectOutlet({
          outlet: 'modal',
          parentView: 'lineup_orgs.edit'
        });
      }

    }

  });

  /**
   * LineupPeople
   */
  App.LineupPeopleRoute = Ember.Route.extend({

    setupController: function(controller, model){
      var c = this.controllerFor('lineup_people_table');
      c.set('model', this.store.all('lineup_person'));
    },

    renderTemplate: function(){
      this.render();
      this.render( 'lineup_people.table', { into: 'lineup_people', outlet: 'table', controller: 'lineup_people_table' });
    }

  });

  /**
   * LineupPeople.New
   */
  App.LineupPeopleNewRoute = Ember.Route.extend({

    model: function( prefix, options ){
      return this.store.createRecord('lineup_person');
    },

    setupController: function( controller, model ){
      controller.set('model',model);
      controller._createTr( model );
    }

  });

  /**
   * LineupPeople.Edit
   */
  App.LineupPeopleEditRoute = Ember.Route.extend({

    beforeModel: function(){
      return this.store.find('lineup_person')
    },

    model: function( params){
      return this.store.find('lineup_person', params.id);
    },

    setupController: function( controller, model ){
      if( !model.get('curTranslation') )
        model.get('translations').pushObject( this.store.createRecord('translation', { locale: App._curLang, content: '' }) );
      this.store.find('mediafile', { parent: model.get('id'), order: 'position:asc'}).then(function(mediafiles){
        controller.set('mediafiles',mediafiles);
      });
      controller.set('model',model);
    },

    actions: { 

      editMediafileModal: function( mediafile ){
        var c = this.controllerFor('mediafile_editor');
        c.set('model', mediafile);
        c.set('curRoute', this);
        this.render('mediafile_editor', {
          into: 'lineup_people.edit',
          outlet: 'modal'
        });
      },

      closeModal: function( deletedMediafile ){
        if( deletedMediafile )
          this.get('controller.mediafiles').removeObject(deletedMediafile);
        this.disconnectOutlet({
          outlet: 'modal',
          parentView: 'lineup_people.edit'
        });
      }

    }

  });

  App.ApplicationRoute = Em.Route.extend({
  
    beforeModel: function(){
      var self = this;
      var promise = new Ember.RSVP.Promise( processRequirements );
      return promise;

      function processRequirements( resolve, reject ){
        self.store.find('user').then(function(){
          self.store.find('lineup_org').then(function(){
            self.store.find('lineup_entry', { categories: 'festival' }).then(function( festivals ){
              festivals.forEach(function(festival){
                App.get('_availableFestivals').pushObject(festival);
              });
              self.store.find('lineup_person').then(function(){
                self.store.find('label', { type: 'lineup' }).then(function( labels ){
                  App.set('_availableLabels', labels);
                  resolve();
                });
              });
            });
          });
        });
      }
    },

    actions: {
    
      editLabel: function( label ){

        var store = this.store;
        if( !label )
          label = store.createRecord('label', { type: 'lineup' });

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
              if( newRecord ){
                notify('info', Em.I18n.t('label.created', {name: label.get('name')}) );
                App.get('_availableLabels').pushObject(label);
              }
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

  })

  App.ApplicationView = Em.View.extend({
    didInsertElement: function(){
      setupCaminio(this.$());
    }
  });

  App._curLang = currentDomain.lang;

  function getEditLabelContent( label ){
    var str = '<form class="bootbox-form">'+
              '<div class="form-group row">'+
              '<input type="text" value="'+(label.get('name') || '')+'" autocomplete="off" class="bootbox-input bootbox-input-text form-control name col-md-12">'+
              '</div>'+
              '<div class="row margin-top clearfix colors"><label class="control-label col-md-3">'+Em.I18n.t('label.select_color')+'</label>'+
                '<div class="col-md-9">'+
                  caminio.labels.getColors()+
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

})(App);
