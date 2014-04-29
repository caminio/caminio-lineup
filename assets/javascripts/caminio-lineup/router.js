( function( App ){

  App.Router.map( function(){
    this.resource('lineup_entries');
    this.resource('lineup_entries.edit', { path: '/lineup_entries/edit/:id' });
    this.resource('lineup_entries.new', { path: '/lineup_entries/new' });
    this.resource('lineup_orgs');
    this.resource('lineup_orgs.edit', { path: '/lineup_org/edit/:id' });
    this.resource('lineup_orgs.new', { path: '/lineup_org/new' });
    this.resource('lineup_people');
  });

  App.IndexRoute = Ember.Route.extend({
    setupController: function( controller ){
    }
  });

  /**
   * LineupEntries
   */
  App.LineupEntriesRoute = Ember.Route.extend({
    
    setupController: function(controller, model){
      c = this.controllerFor('lineup_entries_table');
      c.set('model', this.store.find('lineup_entry'));
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

    model: function( prefix, options ){
      return this.store.createRecord('lineup_entry');
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

    beforeModel: function(){
      var self = this;
      var promise = new Ember.RSVP.Promise( processRequirements );
      return promise;

      function processRequirements( resolve, reject ){
        self.store.find('lineup_org').then(function(){
          self.store.find('lineup_person').then(function(){
            resolve();
          });
        });
      }
    },

    model: function( prefix, options ){
      return this.store.find('lineup_entry', options.params.id);
    },

    setupController: function( controller, model ){
      this.store.find('mediafile', { parent: model.get('id')}).then(function(mediafiles){
        controller.set('mediafiles',mediafiles);
      });
      this.store.all('lineup_org', { type: 'venue' }).forEach(function(venue){
        controller.get('availableVenues').pushObject(venue);
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

  // orgs

  App.LineupOrgsRoute = Ember.Route.extend({

    setupController: function(controller, model){
      c = this.controllerFor('lineup_orgs_table');
      c.set('model', this.store.find('lineup_org'));
    },

    renderTemplate: function(){
      this.render();
      this.render( 'lineup_orgs.table', { into: 'lineup_orgs', outlet: 'table', controller: 'lineup_orgs_table' });
    }

  });

  /**
   * LineupEntries.New
   */
  App.LineupOrgsNewRoute = Ember.Route.extend({

    model: function( prefix, options ){
      return this.store.createRecord('lineup_org');
    },

    setupController: function( controller, model ){
      controller.set('model',model);
      controller._createTr( model );
    }

  });

  /**
   * LineupEntries.Edit
   */
  App.LineupOrgsEditRoute = Ember.Route.extend({

    beforeModel: function(){
      return this.store.find('lineup_org')
    },

    model: function( prefix, options ){
      return this.store.find('lineup_org', options.params.id);
    },

    setupController: function( controller, model ){
      this.store.find('mediafile', { parent: model.get('id')}).then(function(mediafiles){
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

  App._curLang = currentDomain.lang;


})(App);