( function(){
  
  'use strict';

  App.LineupEventController = Ember.ObjectController.extend({

    isCurrent: function(){
      return this.get('content.id') === this.get('parentController.curEvent.id');
    }.property('parentController.curFile'),

    pastEvent: function(){
      return moment(this.get('starts')).isValid() ? moment(this.get('starts')).endOf('day') < moment() : false;
    }.property('content.start'),

    actions: {
      
      createVenue: function( name, $obj ){
        var self = this;
        var venue = this.get('parentController').store.createRecord('lineup_org', { type: 'venue' });
        var tr = this.get('parentController').store.createRecord('translation', {locale: App._curLang,
                                                                                title: name });
        venue.get('translations').pushObject(tr);
        venue.set('curTranslation', tr);

        venue
          .save()
          .then(function(){
            notify('info', Em.I18n.t('venue.created', { name: venue.get('curTranslation.title') }));
            self.get('parentController.availableVenues').pushObject( venue );
            self.get('content').set('lineup_org', venue);
            $obj.append('<option value="'+venue.get('id')+'">'+venue.get('curTranslation.title')+'</option>');
            $obj.select2('val', venue.get('id'));
          });
      },

      save: function(){
        var content = this.get('content');
        if( !content.get('lineup_org') ){
          $('.lineup-event.editing:visible .select2-container').addClass('error');
          return notify('error', Em.I18n.t('event.venue_required'));
        }
        $('.lineup-event.editing:visible .select2-container').removeClass('error');
        var self = this;
        this.get('parentController.content')
          .save()
          .then(function(){
            notify('info', Em.I18n.t('event.saved', { starts: moment(content.get('starts')).format('LLLL') }));
            if( !content.get('id') )
              return self.get('parentController.content.lineup_events').removeObject(content);
            content.set('editMode',false);
          });
      },

      remove: function(content){
        this.get('parentController.content.lineup_events').removeObject( content );
      },

      toggleEditMode: function(){
        if( !this.get('content.id') ){
          this.get('parentController.lineup_events').removeObject( this.get('content') );
          return this.get('content').deleteRecord();
        }
        this.get('content').set('editMode', (this.get('content.editMode') ? !this.get('content.editMode') : true));
      }

    }
  });


}).call();
