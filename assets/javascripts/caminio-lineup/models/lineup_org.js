( function(){

  'use strict';

  App.LineupOrg = DS.Model.extend({

    type: DS.attr('string', { defaultValue: 'venue' }),
    status: DS.attr('string', { defaultValue: 'published'}),
    translations: DS.hasMany( 'translation', { embedded: 'always' } ),

    curTranslation: function(){
      return this.get('translations').findBy('locale', App._curLang);
    }.property('translations.@each'),

    labels: DS.hasMany( 'label', { async: false, embedded: 'keys' } ),

    street: DS.attr('string'),
    zip: DS.attr('string'),
    city: DS.attr('string'),
    gkz: DS.attr('string'), // gemeindekennziffer (allows)
    country: DS.attr('string', { defaultValue: 'AT'}),
    state: DS.attr('string'),

    members: DS.hasMany('lineup_person'),

    origUrl: DS.attr('string'),

    extRefId: DS.attr('string'),
    extRefSrc: DS.attr('string'),
    extRefNote: DS.attr('string'),
    extRefSyncAt: DS.attr('date'),

    openingHours: DS.attr('string'),
    
    reachByBus: DS.attr('string'),
    reachByTram: DS.attr('string'),
    reachByTrain: DS.attr('string'),

    email: DS.attr('string'),
    phone: DS.attr('string'),

    extUrl: DS.attr('string'),
    videoUrl: DS.attr('string'),
    videoUrlType: DS.attr('string'), // youtube, vimeo

    createdBy: DS.belongsTo('user'),
    createdAt: DS.attr('date'),

    updatedBy: DS.belongsTo('user'),
    updatedAt: DS.attr('date'),

    othersWrite: DS.attr('boolean', { defaultValue: true }),
    notifyMeOnWrite: DS.attr('boolean', { defaultValue: true }),

    usedLocales: function(){
      var locales = this.get('translations').map(function(trans){ return trans.locale; }).join(',');
      if( locales.length < 1 )
        return Em.I18n.t('translation.no');
    }.property('translations'),
    isPublished: function(){
      return this.get('status') === 'published';
    }.property('status'),
    isDraft: function(){
      return this.get('status') === 'draft';
    }.property('status'),
    isVenue: function(){
      return this.get('type') === 'venue';
    }.property('type'),

    isEnsemble: function(){
      return this.get('type') === 'ensemble';
    }.property('type'),

    isOrganizer: function(){
      return this.get('type') === 'organizer';
    }.property('type'),

  });

  Ember.Inflector.inflector.irregular('lineupOrg', 'lineup_orgs');

})( App );
