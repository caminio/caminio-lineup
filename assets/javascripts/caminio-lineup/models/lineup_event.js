( function(){

  'use strict';

  App.LineupEvent = DS.Model.extend({

    starts: DS.attr('date', {defaultValue: moment().hour(20).minutes(0).seconds(0).toDate()}),
    lineup_org: DS.belongsTo('lineup_org'),
    festival: DS.belongsTo('lineup_entry'),
    lineup_entry: DS.belongsTo('lineup_entry'),

    startsDate: function( key, val ){
      var curTime = moment(this.get('starts'));
      if(arguments.length === 2){
        if( val.match(/(\d\d\d\d)-(\d\d)-(\d\d)/) )
          this.set('starts', moment(val+' '+curTime.format('HH:mm')).toDate());
      }
      return moment(this.get('starts')).format('YYYY-MM-DD');
    }.property('starts'),

    startsTime: function( key, val ){
      var curDate = moment(this.get('starts'));
      if(arguments.length === 2){
        if( val.match(/(\d\d):(\d\d)/) )
          this.set('starts', moment(curDate.format('YYYY-MM-DD') + ' '+val).toDate());
      }
      return moment(this.get('starts')).format('HH:mm');
    }.property('starts')

  });

  Ember.Inflector.inflector.irregular('lineupEvent', 'lineup_events');

})( App );
