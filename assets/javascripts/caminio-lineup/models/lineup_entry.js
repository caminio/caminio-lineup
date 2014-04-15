( function(){

  'use strict';

  App.LineupEntry = DS.Model.extend({

    type: DS.attr('string', { defaultValue: 'ttp' }),
    requestReviewBy: DS.belongsTo('user'),
    requestReviewMsg: DS.attr(),
    status: DS.attr('string', { defaultValue: 'draft'}),
    translations: DS.hasMany( 'translation' ),
    
    recommendedAge: DS.attr('number'),
    durationMin: DS.attr('number'),
    numBreaks: DS.attr('number'),

    tags: DS.attr('array'),

    ensembles: DS.hasMany('lineup_org'),
    organizers: DS.hasMany('lineup_org'),
    venues: DS.hasMany('lineup_org'),

    extRefId: DS.attr('string'),
    extRefSrc: DS.attr('string'),
    extRefNote: DS.attr('string'),
    extRefSyncAt: DS.attr('date'),

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
    inReview: function(){
      return this.get('status') === 'review';
    }.property('status'),
    isDraft: function(){
      return this.get('status') === 'draft';
    }.property('status')
  });

  Ember.Inflector.inflector.irregular('lineupEntry', 'lineup_entries');

})( App );