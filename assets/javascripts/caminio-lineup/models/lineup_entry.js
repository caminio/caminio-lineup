( function(){

  'use strict';

  App.LineupEntry = DS.Model.extend({

    type: DS.attr('string', { defaultValue: 'ttp' }),
    requestReviewBy: DS.belongsTo('user'),
    requestReviewMsg: DS.attr(),

    status: DS.attr('string', { defaultValue: 'draft'}),
    translations: DS.hasMany( 'translation', { embedded: 'always' } ),
    categories: DS.attr('array'),
    lineup_jobs: DS.hasMany( 'lineup_job', { embedded: 'always' } ),

    labels: DS.hasMany( 'label', { async: false, embedded: 'keys' } ),
    
    recommendedAge: DS.attr('number'),
    durationMin: DS.attr('number'),
    numBreaks: DS.attr('number'),

    notifyCreatorOnChange: DS.attr('boolean', { defaultValue: true }),

    filename: DS.attr('string'),

    age: DS.attr('number'),

    lineup_events: DS.hasMany('lineup_event', { embedded: 'always', inverse: 'lineup_entry' }),
    ensembles: DS.hasMany('lineup_org', { embedded: 'keys' }), // DANGER: DaT!!!
    organizers: DS.hasMany('lineup_org'),
    venues: function(){
      var venues = [];
      var venueIds = [];
      this.get('lineup_events').forEach(function(evnt){
        if( evnt.get('lineup_org') && venueIds.indexOf(evnt.get('lineup_org.id')) < 0 ){
          venues.push(evnt.get('lineup_org'));
          venueIds.push(evnt.get('lineup_org.id'));
        }
      });
      return venues;
    }.property('lineup_events.@each'),

    extRefId: DS.attr('string'),
    extRefSrc: DS.attr('string'),
    extRefNote: DS.attr('string'),
    extRefSyncAt: DS.attr('date'),

    origProjectUrl: DS.attr('string'),
    videoId: DS.attr('string'),
    videoIdTransformer: function(){
      if( !this.get('videoId') )
        return;
      if( this.get('videoId').indexOf('?v=') > 0 ){
        this.set('videoId', this.get('videoId').split('?v=')[1] );
        this.set('videoProvider', 'youtube');
      }
      else if( this.get('videoId').indexOf('vimeo.com/') >= 0 ){
        this.set('videoId', this.get('videoId').split('vimeo.com/')[1] );
        this.set('videoProvider', 'vimeo');
      }
    }.observes('videoId'),

    videoProvider: DS.attr('string', {defaultValue: 'youtube'}), // youtube, vimeo

    createdBy: DS.belongsTo('user'),
    createdAt: DS.attr('date'),

    updatedBy: DS.belongsTo('user'),
    updatedAt: DS.attr('date'),

    othersWrite: DS.attr('boolean', { defaultValue: true }),
    notifyMeOnWrite: DS.attr('boolean', { defaultValue: true }),

    name: function(){
      return this.get('title');
    }.property('title'),
    usedLocales: function(){
      var locales = this.get('translations').map(function(trans){ return trans.locale; }).join(',');
      if( locales.length < 1 )
        return Em.I18n.t('translation.no');
    }.property('translations'),
    isPublished: function(){
      return this.get('status') === 'published';
    }.property('status'),
    inReview: function(){
      return this.get('status') === 'review';
    }.property('status'),
    isDraft: function(){
      return this.get('status') === 'draft';
    }.property('status'),

    curTranslation: function(){
      return this.get('translations').findBy('locale', App._curLang);
    }.property('translations.@each', 'App._curLang'),

    previewLink: function(){
      var url = 'http://'+currentDomain.fqdn+'/drafts/'+this.get('id')+'.htm';
      if( this.get('translations').content.length > 1 )
        url += '.' + App.get('_curLang');
      return url;
    }.property('id'),

    isOwner: function(){
      return ( currentUser.superuser || this.get('createdBy.id') === currentUser._id || 
        ( ( currentDomain._id in currentUser.roles) && currentUser.roles[currentDomain._id] >= 80 ) );
    }.property('createdBy'),

    isFestival: function(){
      return this.get('categories').indexOf('festival') >= 0;
    }.property('categories')
    

  });

  Ember.Inflector.inflector.irregular('lineupEntry', 'lineup_entries');

})( App );
