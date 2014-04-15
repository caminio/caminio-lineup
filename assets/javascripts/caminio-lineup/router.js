( function( App ){

  App.Router.map( function(){
    this.resource('lineup_entries', function(){
      this.resource('lineup_entries.edit', { path: '/edit/:id' });
      this.resource('lineup_entries.table');
      this.resource('lineup_entries.new', { path: '/new' });
    });
    this.resource('lineup_venues');
    this.resource('lineup_people');
    //this.route('lineup_settings');
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

    actions: {
      newItem: function() {
        //var setting = this.get('lineup_setting.content.content')[0];
        var c = this.controllerFor('lineup_entry');
        var model = this.store.createRecord('lineup_entry');
        c.set('model', model);
        c.set('mediafiles', null);
        this.render( 'lineup_entries.new', { into: 'lineup_entries', outlet: 'details', controller: 'lineup_entry' });
      }
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
    setupController: setupControllerLineupEntry,
    renderTemplate: renderTemplateLineupEntry

  });

  /**
   * LineupEntries.Edit
   */
  App.LineupEntriesEditRoute = Ember.Route.extend({

    model: function( prefix, options ){
      return this.store.find('lineup_entry', options.params.id);
    },
    setupController: setupControllerLineupEntry,
    renderTemplate: renderTemplateLineupEntry

  });

  function setupControllerLineupEntry( controller, model ){
    var c = this.controllerFor('lineup_entry');
    if( model.get('id') )
      c.set('mediafiles', this.store.find('mediafile', {parent: model.get('id')}));
    else
      c.set('mediafiles', null);
    c.set('model', model);
    c = this.controllerFor('lineup_entries_table');
    c.set('model', this.store.find('lineup_entry'));
  }

  function renderTemplateLineupEntry( controller, model ){
    this.render( 'lineup_entries', { into: 'application' } );
    this.render( 'lineup_entries.table', { into: 'lineup_entries', outlet: 'table', controller: 'lineup_entries_table' });
    if( this.routeName === 'route:lineupEntriesNew' )
      this.render( 'lineup_entries.new', { into: 'lineup_entries', outlet: 'details', controller: 'lineup_entry' });
    else
      this.render( 'lineup_entries.edit', { into: 'lineup_entries', outlet: 'details', controller: 'lineup_entry' });
  }

})(App);