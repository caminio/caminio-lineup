( function( App ){
  
  'use strict';

  App._curLang = currentDomain.lang;

  var SearchQ = Em.Object.extend({
    title: null,
    start: null,
    end: null,
    createdBy: null,
    labels: Em.A(),
    toJSON: function(){
      var attrs = {};
      if( this.get('title') )
        attrs['translations.title'] = 'regexp(/'+this.get('title')+'/i)';
      if( this.get('start') )
        attrs.start = this.get('start');
      if( this.get('end') )
        attrs.start = this.get('end');
      if( this.get('createdBy') )
        attrs.createdBy = this.get('createdBy');
      if( this.get('labels.length') )
        attrs.labels = this.get('labels').map(function(label){ return label.get('id'); }).join(',');
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

    searchQ: SearchQ.create({ createdBy: currentUser._id }),
    
    actions: {

      'changeLang': function( lang ){
        App.set('_curLang',lang);
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
    }.property('parentController.searchQ.labels.@each')
  });

})( App );
