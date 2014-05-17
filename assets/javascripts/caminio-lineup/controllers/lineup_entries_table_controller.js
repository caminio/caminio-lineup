( function( App ){
  
  'use strict';


  // this controller is in use even if it is empty
  App.LineupEntriesTableController = App.TableController.extend({
  
    sortAscending: false,

    tableHeaders: Em.A([ 
      { name: 'curTranslation.title',
        title: 'entry.title'}, 
      { name: 'period',
        title: 'entry.date',
        width: '150px'},
      { name: 'venues',
        title: 'entry.venues'}, 
      { name: 'updatedAt',
        title: 'updated_at',
        width: '100px'},
      { name: 'updatedBy',
        title: 'updated_by',
        width: '100px'} ])

  });

})( App );
