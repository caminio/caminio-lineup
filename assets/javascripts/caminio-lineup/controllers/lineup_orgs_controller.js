( function(){
  
  'use strict';

  App._curLang = currentDomain.lang;

  var SearchQ = Em.Object.extend({
    title: null,
    start: null,
    end: null,
    createdBy: null,
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
      return attrs;
    }
  });

  App.LineupOrgsController = Ember.Controller.extend({
    
    needs: ['lineup_orgs_table'],

    curLang: currentDomain.lang,
    
    searchQ: SearchQ.create({ createdBy: currentUser._id }),
    
    actions: {

      'changeLang': function( lang ){
        App.set('_curLang',lang);
      },

      newItem: function(){
        this.transitionToRoute('lineup_venues.new');
      },

      search: function(){
        console.log(this.get('searchQ'));
        this.get('controllers.lineup_orgs_table').set('content', this.store.find('lineup_org', this.get('searchQ').toJSON()));
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
      }

    }

  });

}).call();
