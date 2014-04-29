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
            self.get('parentController.availableVenues').pushObject( person );
            self.get('content').set('person', person);
            $obj.append('<option value="'+person.get('id')+'">'+person.get('name')+'</option>');
            $obj.select2('val', person.get('id'));
          });
      },

      save: function(){
        var content = this.get('content');
        var self = this;
        this.get('parentController.content')
          .save()
          .then(function(){
            notify('info', Em.I18n.t('job.saved', { name: content.get('person.name') }));
            if( !content.get('id') )
              return self.get('parentController.content.lineup_jobs').removeObject(content);
            content.set('editMode',false);
          });
      },

      remove: function(content){
        this.get('parentController.content.lineup_jobs').removeObject( content );
      },

      toggleEditMode: function(){
        this.get('content').set('editMode', (this.get('content.editMode') ? !this.get('content.editMode') : true));
      }

    }
  });


}).call();