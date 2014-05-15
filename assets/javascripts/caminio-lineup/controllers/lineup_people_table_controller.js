( function( App ){
  
  'use strict';

  App.LineupPeopleTableController = App.TableController.extend({
  
    sortAscending: false,

    tableHeaders: Em.A([ 
      { name: 'name',
        title: 'person.name'}, 
      { name: 'city',
        title: 'org.city'}, 
      { name: 'updatedAt',
        title: 'updated_at'},
      { name: 'updatedBy',
        title: 'updated_by'} ])

  });

})( App );
