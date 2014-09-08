( function(){
  
  'use strict';

  App.LineupJobController = Ember.ObjectController.extend({

    actions: {
      createPerson: function( name, $obj ){
        var self = this;
        var person = this.get('parentController').store.createRecord('lineup_person', { 
                                                                        firstname: name.split(/\s+/)[0], 
                                                                        lastname: name.split(/\s+/)[1] });

        person
          .save()
          .then(function(){
            notify('info', Em.I18n.t('person.created', { name: person.get('name') }));
            self.get('parentController.availablePeople').pushObject( person );
            self.get('content').set('lineup_person', person);
            $obj.append('<option value="'+person.get('id')+'">'+person.get('name')+'</option>');
            $obj.select2('val', person.get('id'));
          });
      },

      save: function(){
        var content = this.get('content');
        if( !content.get('lineup_person') ){
          $('.job.editing:visible .select2-container').addClass('error');
          return notify('error', Em.I18n.t('event.person_required'));
        }
        this.get('parentController.content').send('becomeDirty');
        return content.set('editMode',false);
      },

      remove: function(content){
        this.get('parentController.content.lineup_jobs').removeObject( content );
      },

      toggleEditMode: function(){
        // if( this.get('content.isNew') ){
        //   this.get('parentController.lineup_jobs').removeObject( this.get('content') );
        //   return this.get('content').deleteRecord();
        // }
        this.get('content').set('editMode', (this.get('content.editMode') ? !this.get('content.editMode') : true));
      }

    }
  });


}).call();
