( function( App ){
  
  'use strict';


  // this controller is in use even if it is empty
  App.LineupOrgsTableController = App.TableController.extend({
  
    sortAscending: false,

    tableHeaders: Em.A([ 
      { name: 'curTranslation.title',
        title: 'org.name'}, 
      { name: 'city',
        title: 'org.city'}, 
      { name: 'updatedAt',
        title: 'updated_at'},
      { name: 'updatedBy',
        title: 'updated_by'} ])

  });

})( App );
