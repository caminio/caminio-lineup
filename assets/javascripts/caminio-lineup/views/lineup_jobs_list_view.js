(function( App ){
  
  'use strict';

  App.LineupJobsListView = Ember.View.extend({

    templateName: 'lineup_jobs/list',

    didInsertElement: function(){
      var self = this;
      this.$('.jobs-list').sortable({
        revert: 'invalid',
        handle: '.move-job',
        update: function(){
          self.$('.job').each(function(){
            var obj = self.get('controller').store.getById( 'lineup_job', $(this).attr('data-id') );
            self.get('controller.lineup_jobs').removeObject( obj );
            self.get('controller.lineup_jobs').pushObject( obj );
            self.get('controller.content').send('becomeDirty');
          });
        }
      });

    }

  });

})( App );
