( function( App ){
  
  'use strict';

  App._curLang = currentDomain.lang;

  var SearchQ = Em.Object.extend({
    title: null,
    end: null,
    createdBy: null,
    startsAt: null,
    onlyMine: function(ns, value){
      if( typeof(value) !== 'undefined' )
        this.set('createdBy', value ? currentUser._id : null);
      console.log('min is', this.get('createdBy'));
      return typeof(this.get('createdBy')) === 'string';
    }.property('createdBy'),
    onlyFuture: function(ns, value){
      if( typeof(value) !== 'undefined' )
        this.set('startsAt', value ? moment().startOf('day').toISOString() : null );
      return typeof(this.get('startsAt')) === 'string';
    }.property('startsAt'),
    labels: Em.A(),
    toJSON: function(){
      var attrs = {};
      if( !Em.isEmpty(this.get('title')) )
        attrs['translations.title'] = 'regexp(/'+this.get('title')+'/i)';
      if( !Em.isEmpty(this.get('startsAt')) )
        attrs['lineup_events.starts'] = 'gteDate('+this.get('startsAt')+')';
      if( !Em.isEmpty(this.get('end')) )
        attrs.start = this.get('end');
      if( !Em.isEmpty(this.get('createdBy')) )
        attrs.createdBy = this.get('createdBy');
      if( this.get('labels.length') > 0 )
        attrs.labels = 'in('+this.get('labels').map(function(label){ return label.get('id'); }).join(',')+')';
      return attrs;
    }
  });
  
  App.LineupEntriesController = Ember.Controller.extend({
   
    needs: ['lineup_entries_table'],

    multiLangs: function(){
      return domainSettings.availableLangs.length > 1;
    }.property(),

    availableLangs: function(){
      return domainSettings.availableLangs;
    }.property(),

    searchQ: SearchQ.create({ createdBy: (App.get('emberUser.isAdmin') ? null : currentUser._id), startsAt: moment().startOf('day').toISOString() }),
    
    actions: {

      'changeLang': function( lang ){
        App.set('_curLang',lang);
      },

      'export': function(){
        location.href = '/caminio/lineup/'+currentDomain._id+'/export?dialect=dat'
      },

      newItem: function(){
        this.transitionToRoute('lineup_entries.new');
      },

      search: function(){
        this.get('controllers.lineup_entries_table').set('content', this.store.find('lineup_entry', this.get('searchQ').toJSON()));
        App._selTableItems.clear();
      },

      toggleAdvSearch: function(){
        var self = this;
        this.set('advSearch', (this.get('advSearch') ? false : true));
        if( this.get('advSearch') ){
          setTimeout(function(){
            $('.adv-search').slideDown();
            $('.search-group').slideUp();
          }, 1);
        } else {
          $('.adv-search').slideUp();
          $('.search-group').slideDown(); 
        }
      },

      toggleLabelOrLabelContent: function( label ){
        if( App.get('_selTableItems.length') ){
          App.get('_selTableItems').forEach(function(item){
            if( item.get('labels').findBy('id', label.get('id') ) )
              item.get('labels').removeObject(label);
            else
              item.get('labels').pushObject(label);
            item.save();
          });
        } else {
          if( this.get('searchQ.labels').findBy('id', label.get('id') ) )
            this.get('searchQ.labels').removeObject(label);
          else
            this.get('searchQ.labels').pushObject(label);
          this.send('search');
        }
      },


    }

  });

  App.LabelItemController = Em.ObjectController.extend({
    isActive: function(){
      return this.get('parentController.searchQ.labels').findBy('id', this.get('content.id') );
    }.property('parentController.searchQ.labels.@each'),
    actions: {
      'removeLabel': function( label ){
        var self = this;
        bootbox.confirm( Em.I18n.t('label.really_delete', {name: label.get('name')}), function( result ){
          if( result ){
            label.deleteRecord();
            label.save()
              .then(function(){
                App.set('_availableLabels', self.store.find('label', { type: 'lineup' }));
                notify('info', Em.I18n.t('label.deleted', {name: label.get('name')}));
              })
              .catch( function(err){
                notify('error', err);
              });
          }
        });
      }
    }
  });

})( App );
