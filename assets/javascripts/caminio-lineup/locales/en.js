(function(){

  'use strict';

  if( currentLang !== 'en' ) return;

  var translations = {

    'nav.overview': 'Overview',
    'nav.entries': 'Entries',
    'nav.venues': 'Venues',
    'nav.people': 'People',
    'nav.settings': 'Settings',

    'lineup_overview': 'Line up overview',

    'entries.title': 'Line up entries',

    'entry.title': 'Title',
    'entry.date': 'Date',
    'entry.venues': 'Venue(s)',
    'entry.create': 'Create new line up entry',
    'entry.description': 'Description',
    'entry.meta_keywords': 'Keywords',
    'entry.author': 'Author',
    'entry.director': 'Director',

    'entries.search': 'Search',
    'entries.search.quick': 'Quick search',
    'entries.search.advanced': 'Advanced search',
    
  };

  for( var i in translations )
    Em.I18n.translations[i] = translations[i];

}).call();