( function( App ){

  App.Router.map( function(){
    this.resource('lineup_entries');
    this.resource('lineup_entries.edit', { path: '/edit/:id' });
    this.resource('lineup_entries.new', { path: '/new' });
    this.resource('lineup_venues');
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
      // var setting = this.store.find('lineup_setting');
      // this.set('shop_setting', setting);

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

    model: function( prefix, options ){
      return this.store.find('lineup_entry', options.params.id);
    },

    setupController: function( controller, model ){
      controller.set('model',model);
    }

  });


})(App);