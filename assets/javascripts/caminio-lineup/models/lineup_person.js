( function(){

  'use strict';

  App.LineupPerson = DS.Model.extend({

    status: DS.attr('string', { defaultValue: 'published'}),
    translations: DS.hasMany( 'translation', { embedded: 'always' } ),

    tags: DS.attr('array'),

    firstname: DS.attr('string'),
    lastname: DS.attr('string'),
    midname: DS.attr('string'),

    street: DS.attr('string'),
    zip: DS.attr('string'),
    city: DS.attr('string'),
    gkz: DS.attr('string'), // gemeindekennziffer (allows)
    country: DS.attr('string', { defaultValue: 'AT' }),
    state: DS.attr('string'),

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
    }.property('status'),

    name: function( ns, value ){
      if( value ){
        this.set('firstname', value);
        if( value.split(' ').length > 1 ){
          this.set('firstname', value.split(' ')[0] );
          this.set('lastname', value.replace( value.split(' ')[0],'') );
        }
      }
      var name = '';
      if( this.get('firstname') && this.get('firstname').length > 0 )
        name += this.get('firstname');
      if( name.length > 0 && this.get('lastname') && this.get('lastname').length > 0 )
        name += ' ';
      if( this.get('lastname') && this.get('lastname').length > 0 )
        name += this.get('lastname');
      return name;
    }.property('firstname', 'lastname')

  });

  Ember.Inflector.inflector.irregular('lineupPerson', 'lineup_people');
  Ember.Inflector.inflector.irregular('lineup_person', 'lineupPeople');

})( App );
