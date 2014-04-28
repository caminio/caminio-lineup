( function(){

  'use strict';

  App.LineupOrg = DS.Model.extend({

    type: DS.attr('string', { defaultValue: 'ensemble' }),
    status: DS.attr('string', { defaultValue: 'draft'}),
    translations: DS.hasMany( 'translation', { embedded: 'always' } ),

    curTranslation: function(){
      return this.get('translations').findBy('locale', App._curLang);
    }.property('translations.@each'),

    tags: DS.attr('array'),

    street: DS.attr('string'),
    zip: DS.attr('string'),
    city: DS.attr('string'),
    gkz: DS.attr('string'), // gemeindekennziffer (allows)
    country: DS.attr('string'),
    state: DS.attr('string'),

    members: DS.hasMany('lineup_person'),

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
    isDraft: function(){
      return this.get('status') === 'draft';
    }.property('status')
  });

  Ember.Inflector.inflector.irregular('lineupOrg', 'lineup_orgs');

})( App );